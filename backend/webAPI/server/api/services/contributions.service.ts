import { Status } from '../models/Status';
import { Contribution } from '../models/Contribution';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ContributionExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { FileDTO } from '../models/DTO/File.DTO';
import { FilesService } from './files.service';
import notificationsService from './notifications.service';
import usersService from './users.service';
import { User } from '../models/User';
import { NotificationSentThrough } from '../models/NotificationSentThrough';
import { NotificationSentType } from '../models/NotificationSentType';
import path from 'path';

const prisma = new PrismaClient();
const model = 'contributions';
const axios = require('axios');
const JSZip = require('jszip');
const { saveAs } = require('file-saver');

export class ContributionsService implements ISuperService<Contribution> {
  private fileService = new FilesService();
  async all(depth?: number, isPublic?: boolean): Promise<any> {
    var select: any = {
      ID: true,
      Name: true,
      Content: true,
      IsPublic: true,
      IsApproved: true,
      CreatedAt: true,
      UpdatedAt: true,
      EventID: true,
      UserID: true,
      StatusID: true,
      LastEditByID: true,
    };
    if (depth == 1) {
      select.User = { select: { ID: true, Name: true } };
      select.Event = { select: { ID: true, Name: true } };
      select.Files = { select: { ID: true, Url: true } };
      select.Status = true;
      select.Comments = true;
    }
    if(isPublic == true) {
      var where: any =  { IsPublic: isPublic };
    }else{
      var where = undefined;
    }
    const contributions = await prisma.contributions.findMany({ select, where });
    L.info(contributions, `fetch all ${model}(s)`);

    // return Promise.resolve(contributions);;

    return contributions.map((contribution) => {
      if (contribution.Files) {
        try {
          const filesAsDTOs = this.toFileDTOArray(contribution.Files || []);
          const { textFiles, imageFiles } = this.classifyFiles(filesAsDTOs);
          return {
            ...contribution,
            TextFiles: textFiles,
            ImageFiles: imageFiles,
          };
        } catch (error) {
          L.error(` failed: ${error}`);
          return Promise.reject({
            error: ContributionExceptionMessage.INVALID,
            message: ContributionExceptionMessage.BAD_REQUEST
          });
        }
      }
      return contribution;
    });
  }
  toFileDTOArray(files: any[]): FileDTO[] {
    return files.map((file) => {
      const url = file.Url || 'default/url';
      return new FileDTO({
        ID: file.ID,
        Url: url,
        CreatedAt: file.CreatedAt || null,
        UpdatedAt: file.UpdatedAt || null,
        ContributionID: file.ContributionID,
        Content: file.Content,
        UserID: file.UserID,
      });
    });
  }
  classifyFiles(files: FileDTO[]) {
    const textFiles: FileDTO[] = [];
    const imageFiles: FileDTO[] = [];

    files?.forEach((file) => {
      if (file.Url) {
        if (file.Url.endsWith('.pdf') || file.Url.endsWith('.docx')) {
          textFiles.push(file);
        } else if (
          file.Url.endsWith('.png') ||
          file.Url.endsWith('.jpeg') ||
          file.Url.endsWith('.JPG')  ||
          file.Url.endsWith ('jpg')
        ) {
          imageFiles.push(file);
        }
      }
    });

    return { textFiles, imageFiles };
  }

async  downloadFilesAndZip(files: FileDTO[]) {
  const zip = new JSZip();
  for (const file of files) {
    try {
      const response = await axios.get(file.Url, { responseType: 'arraybuffer' });
      const fileName = path.basename(new URL(file.Url as string).pathname);
      L.info({fileName})
      L.info({response  })
      const fileData = Buffer.from(response.data);
      zip.file(fileName, fileData);
    } catch (error) {
      console.error(`Failed to download file: ${file.Url}`, error);
    }
  }

  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  return zipContent;
  }

  async byId(id: number, depth?: number, comment?: boolean, file?: boolean,): Promise<any> {
    // L.info(`fetch ${model} with id ${id}`);
    var select: any = {
      ID: true,
      Name: true,
      Content: true,
      IsPublic: true,
      IsApproved: true,
      CreatedAt: true,
      UpdatedAt: true,
      EventID: true,
      UserID: true,
      StatusID: true,
      LastEditByID: true,
    };
    if (depth == 1) {
      select.User = { select: { ID: true, Name: true } };
      select.Event = { select: { ID: true, Name: true,FinalDate: true, ClosureDate: true } };
      select.Status = { select: { ID: true, Name: true } };
      select.Files = { select: { ID: true, Url: true } };
    }

    if (comment == true)
      select.Comments = {
        select: {
          ID: true,
          Content: true,
          UserID: true,
          User: { select: { ID: true, Name: true } },
        },
        where: { ContributionID: id },
      };
    if (file == true)
      select.Files = {
        select: { ID: true, Url: true },
        where: { ContributionID: id },
      };

    const contribution = await prisma.contributions.findUnique({
      select,
      where: { ID: id },
    });
    try {
      
      if (contribution) {
      const filesAsDTOs = this.toFileDTOArray(contribution.Files || []);
      const { textFiles, imageFiles } = this.classifyFiles(filesAsDTOs);
    return {
        ...contribution,
        TextFiles: textFiles,
        ImageFiles: imageFiles,
    };
  }
    } catch (error) {
      L.error(` failed: ${error}`);
    }
    return Promise.resolve(contribution);
  }

  filter(filter: string, key: string): Promise<any> {
    L.info(`fetch ${model}(s) with filter`, filter);
    const contributions = prisma.contributions.findMany({
      where: {
        [filter]: key,
      },
    });
    return Promise.resolve(contributions);
  }

  async create(contribution: Contribution): Promise<any> {
    // const validations = await this.validateConstraints(contribution);
    // if (!validations.isValid) {
    //   return Promise.resolve({
    //     error: validations.error,
    //     message: validations.message,
    //   });
    // }
    L.info(`create ${model} with id ${contribution.ID}`);
    return prisma.contributions
      .create({
        data: {
          Name: contribution.Name,
          Content: contribution.Content,
          IsPublic: false,
          IsApproved: false,
          EventID: contribution.EventID,
          UserID: contribution.UserID,
          StatusID: Status.PENDING as number,
        },
      })
      .then((contribution) => {
        // Sent create success notification
        // find faculty
        var success = usersService
          .byId(contribution.UserID)
          .then((student: User) => {
            return prisma.users
              .findFirst({ where: { FacultyID: student.FacultyID, RoleID: 3 } })
              .then((coordinator) => {
                if (coordinator || coordinator == null) {
                  // prepare notification
                  var payload: any = {
                    Contribution: {
                      User: {
                        Name: student.Name,
                      },
                      ID: contribution.ID,
                      Name: contribution.Name,
                    },
                  };
                  // sent
                  notificationsService.trigger(
                    coordinator as User,
                    payload,
                    NotificationSentType.NEWCONTRIBUTION,
                    NotificationSentThrough.InApp
                  );
                  // log
                  L.info('Sent Notification: ' + payload);
                  // return success
                  return Promise.resolve(true);
                } else {
                  L.error('Coordinator not found: ' + coordinator);
                  return Promise.resolve(false);
                }
              })
              .catch((e) => {
                L.error(e);
                return Promise.resolve(false);
              });
          });

        return Promise.resolve(contribution);
      })
      .catch((error) => {
        L.error(`create ${model} failed: ${error}`);
        return Promise.reject({
          error: ContributionExceptionMessage.INVALID,
          message: ContributionExceptionMessage.BAD_REQUEST,
        });
      });
  }

  delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    // First, attempt to delete related files to avoid foreign key constraint issues
    return prisma.files.deleteMany({
      where: {
        ContributionID: id,
      },
    })
    .then(() => {
      // After successfully deleting files, delete the contribution
      return prisma.contributions.delete({
        where: { ID: id },
      });
    })
    .then((r) => {
      // If both deletions are successful, resolve with the result of deleting the contribution
      return Promise.resolve(r);
    })
    .catch((err) => {
      // If an error occurs in either deletion step, log the error and resolve with an error object
      L.error(`delete ${model} failed: ${err}`);
      return Promise.resolve({
        error: 'An error occurred while attempting to delete the contribution and/or its related files.',
        message: 'Bad Request',
      });
    });
  }

  async update(id: number, contribution: Contribution): Promise<any> {
    L.info(`update ${model} with id ${contribution.ID}`);
    return prisma.contributions
      .update({
        where: { ID: id },
        data: {
          Name: contribution.Name,
          Content: contribution.Content,
          IsPublic: contribution.IsPublic,
          IsApproved: contribution.StatusID === Status.ACCEPTED ? true : false,
          EventID: contribution.EventID,
          UserID: contribution.UserID,
          StatusID: contribution.StatusID,
        },
      })
      .then((updated) => {
        if(!(updated.StatusID === contribution.StatusID)) {
          //TODO NOTI
        }

        return Promise.resolve(updated);
      })
      .catch((error) => {
        L.error(`update ${model} failed: ${error}`);
        return Promise.reject({
          error: ContributionExceptionMessage.INVALID,
          message: ContributionExceptionMessage.BAD_REQUEST,
        });
      });
  }

  async validateConstraints(
    contribution: Contribution
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    // Validate Name
    if (!contribution.Name || !/^[A-Za-z\s]{1,15}$/.test(contribution.Name)) {
      return {
        isValid: false,
        error: ContributionExceptionMessage.INVALID,
        message:
          'Contribution name is invalid, cannot contain numbers or special characters, and must have a maximum of 15 characters.',
      };
    }

    // Validate Content
    if (!contribution.Content || contribution.Content.length > 3000) {
      return {
        isValid: false,
        error: ContributionExceptionMessage.INVALID,
        message:
          'Content is invalid or too long, with a maximum of 3000 characters.',
      };
    }

    // Validate IsApproved and IsPublic
    if (
      typeof contribution.IsApproved !== 'boolean' ||
      typeof contribution.IsPublic !== 'boolean'
    ) {
      return {
        isValid: false,
        error: ContributionExceptionMessage.INVALID,
        message: 'IsApproved and IsPublic must be boolean values.',
      };
    }

    // Validate linkage IDs
    // Similar checks for EventID, StatusID, UserID, LastEditUserID...
    const eventExists = await prisma.events.findUnique({
      where: { ID: contribution.EventID },
    });
    if (!eventExists) {
      return {
        isValid: false,
        error: ContributionExceptionMessage.INVALID_EVENTID,
        message: 'Referenced event does not exist.',
      };
    }
    const userExists = await prisma.users.findUnique({
      where: { ID: contribution.UserID },
    });
    if (!userExists) {
      return {
        isValid: false,
        error: ContributionExceptionMessage.INVALID_USERID,
        message: 'Referenced user does not exist.',
      };
    }
    // const lastEditByIdExists = await prisma.users.findUnique({
    //   where: { ID: contribution.LastEditByID },
    // });
    // if (!lastEditByIdExists) {
    //   return {
    //     isValid: false,
    //     error: ContributionExceptionMessage.INVALID_EVENTID,
    //     message: 'Referenced user does not exist.',
    //   };
    // }
    const statusExists = await prisma.contributionStatuses.findUnique({
      where: { ID: contribution.StatusID },
    });
    if (!statusExists) {
      return {
        isValid: false,
        error: ContributionExceptionMessage.INVALID_EVENTID,
        message: 'Referenced status does not exist.',
      };
    }
    // If all validations pass
    return { isValid: true };
  }
}

export default new ContributionsService();
