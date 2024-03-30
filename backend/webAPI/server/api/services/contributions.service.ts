import { Status } from '../models/Status';
import { Contribution } from '../models/Contribution';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ContributionExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { FileDTO } from '../models/DTO/File.DTO';
import { FilesService } from './files.service';

const prisma = new PrismaClient();
const model = 'contributions';

export class ContributionsService implements ISuperService<Contribution> {
  private fileService = new FilesService();
  async all(depth?: number): Promise<any> {
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
    const contributions = await prisma.contributions.findMany({ select });
    L.info(contributions, `fetch all ${model}(s)`);
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

          return Promise.resolve({
            error: ContributionExceptionMessage.INVALID,
            message: ContributionExceptionMessage.BAD_REQUEST,
          });
        }
      }
      return contribution;
    });
    return Promise.resolve(contributions);
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
          file.Url.endsWith('.JPG')
        ) {
          imageFiles.push(file);
        }
      }
    });

    return { textFiles, imageFiles };
  }

  byId(
    id: number,
    depth?: number,
    comment?: boolean,
    file?: boolean
  ): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
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
      select.Status = { select: { ID: true, Name: true } };
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

    const contribution = prisma.contributions.findUnique({
      select,
      where: { ID: id },
    });
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
    try {
      L.info(`create ${model} with id ${contribution.ID}`);
      const createdContribution = prisma.contributions.create({
        data: {
          Name: contribution.Name,
          Content: contribution.Content,
          IsPublic: contribution.IsPublic,
          IsApproved: contribution.IsApproved,
          EventID: contribution.EventID,
          UserID: contribution.UserID,
          StatusID: Status.PENDING as number,
        },
      });
      return Promise.resolve(createdContribution);
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);

      return Promise.reject({
        error: ContributionExceptionMessage.INVALID,
        message: ContributionExceptionMessage.BAD_REQUEST,
      });
    }
  }

  async createFile(
    files: Array<{ Path: string }>,
    ContributionID: number
  ): Promise<any> {
    try {
      L.info(`create ${model} with id ${ContributionID}`);
      if (files) {
        const uploadedFiles = await Promise.all(
          files.map(async (filePath) => {
            // const url = await this.fileService.uploadFileToBlob(filePath.Path);
            const fileData = {
              Url: '',
              ContributionID: ContributionID,
              Path: filePath.Path,
            };
            return await this.fileService.create(fileData);
          })
        );
      }

      return Promise.resolve();
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);

      return Promise.resolve({
        error: ContributionExceptionMessage.INVALID,
        message: ContributionExceptionMessage.BAD_REQUEST,
      });
    }
  }
  delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    return prisma.contributions
      .delete({
        where: { ID: id },
      })
      .then((r) => {
        return Promise.resolve(r);
      })
      .catch((err) => {
        L.error(`delete ${model} failed: ${err}`);
        return Promise.resolve({
          error: ContributionExceptionMessage.INVALID,
          message: ContributionExceptionMessage.BAD_REQUEST,
        });
      });
  }

  async update(id: number, contribution: Contribution): Promise<any> {
    const validations = await this.validateConstraints(contribution);
    if (!validations.isValid) {
      return Promise.resolve({
        error: validations.error,
        message: validations.message,
      });
    }
    try {
      if (!this.validateConstraints(contribution)) {
        return Promise.resolve({
          error: ContributionExceptionMessage.INVALID,
          message: ContributionExceptionMessage.BAD_REQUEST,
        });
      }
      L.info(`update ${model} with id ${contribution.ID}`);
      const updatedContribution = prisma.contributions.update({
        where: { ID: id },
        data: {
          Name: contribution.Name,
          Content: contribution.Content,
          IsPublic: contribution.IsPublic,
          IsApproved: contribution.IsApproved,
          EventID: contribution.EventID,
          UserID: contribution.UserID,
          StatusID: contribution.StatusID,
        },
      });
      return Promise.resolve(updatedContribution);
    } catch (error) {
      L.error(`update ${model} failed: ${error}`);
      return Promise.resolve({
        error: ContributionExceptionMessage.INVALID,
        message: ContributionExceptionMessage.BAD_REQUEST,
      });
    }
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
        error: ContributionExceptionMessage.INVALID_LASTEDITBYID,
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
