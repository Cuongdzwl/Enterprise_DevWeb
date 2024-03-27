import { Status } from '../models/Status';
import { Contribution } from '../models/Contribution';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ContributionExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';

const prisma = new PrismaClient();
const model = 'contributions';

export class ContributionsService implements ISuperService<Contribution> {
  all(depth?: number): Promise<any> {
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
      LastEditByID :  true
    };
    if (depth == 1) {
      select.User =  {select: {ID: true, Name: true}}
      select.Event =  {select: {ID: true, Name: true}}
      select.Status =  {select: {ID: true, Name: true}}
    }
    const contributions = prisma.contributions.findMany({select});
    L.info(contributions, `fetch all ${model}(s)`);
    return Promise.resolve(contributions);
  }

  byId(id: number, depth?: number, comment?: boolean, file?: boolean): Promise<any> {
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
      LastEditByID :  true
    };
    if (depth == 1) {
      select.User =  {select: {ID: true, Name: true}}
      select.Event =  {select: {ID: true, Name: true}}
      select.Status =  {select: {ID: true, Name: true}};
    }

    if(comment == true)
      select.Comments =  {select: {ID: true, Content: true,UserID: true, User : { select:{ID : true, Name: true}}}, where :{ ContributionID: id}};
    if(file == true)
      select.Files =  {select: {ID: true, Url: true}, where :{ ContributionID : id}};

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

      return Promise.resolve({
        error: ContributionExceptionMessage.INVALID,
        message: ContributionExceptionMessage.BAD_REQUEST,
      });
    }
  }

  delete(id: number): Promise<any> {
    try {
      L.info(`delete ${model} with id ${id}`);
      const deletedContribution = prisma.contributions.delete({
        where: { ID: id },
      });
      return Promise.resolve(deletedContribution);
    } catch (error) {
      L.error(`delete ${model} failed: ${error}`);
      return Promise.resolve({
        error: ContributionExceptionMessage.INVALID,
        message: ContributionExceptionMessage.BAD_REQUEST,
      });
    }
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
