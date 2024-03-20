import { Status } from '../models/Status';
import { Contribution } from '../models/Contribution';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';

const prisma = new PrismaClient();
const model = 'contributions';

export class ContributionsService implements ISuperService<Contribution>{
  all(): Promise<any> {
    const contributions = prisma.contributions.findMany();
    L.info(contributions, `fetch all ${model}(s)`);
    return Promise.resolve(contributions);
  }

  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const contribution = prisma.contributions.findUnique({
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
    const validations = await this.validateConstraints(contribution)
    if (!validations.isValid) {
      return Promise.resolve({
        error: validations.error,
        message: validations.message,
      });
    }
    try {
      if (!this.validateConstraints(contribution)) {
        return Promise.resolve({
          error: ExceptionMessage.INVALID,
          message: ExceptionMessage.BAD_REQUEST,
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
      L.error(`create ${model} failed: ${error}`)

      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  delete(id: number): Promise<any> {
    try{
      L.info(`delete ${model} with id ${id}`);
      const deletedContribution = prisma.contributions.delete({
        where: { ID: id },
      });
      return Promise.resolve(deletedContribution);
    }catch(error){
      L.error(`delete ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  async update(id: number ,contribution: Contribution): Promise<any> {
    const validations = await this.validateConstraints(contribution)
    if (!validations.isValid) {
      return Promise.resolve({
        error: validations.error,
        message: validations.message,
      });
    }
    try {
      if (!this.validateConstraints(contribution)) {
        return Promise.resolve({
          error: ExceptionMessage.INVALID,
          message: ExceptionMessage.BAD_REQUEST,
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
      L.error(`update ${model} failed: ${error}`)
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  async validateConstraints(contribution: Contribution): Promise<{isValid: boolean, error?: string, message?: string}> {
    // Validate Name
    if (!contribution.Name || !/^[A-Za-z\s]{1,15}$/.test(contribution.Name)) {
        return { isValid: false, error: ExceptionMessage.INVALID, message: "Contribution name is invalid, cannot contain numbers or special characters, and must have a maximum of 15 characters." };
    }

    // Validate Content
    if (!contribution.Content || contribution.Content.length > 3000) {
        return { isValid: false, error: ExceptionMessage.INVALID, message: "Content is invalid or too long, with a maximum of 3000 characters." };
    }

    // Validate IsApproved and IsPublic
    if (typeof contribution.IsApproved !== 'boolean' || typeof contribution.IsPublic !== 'boolean') {
        return { isValid: false, error: ExceptionMessage.INVALID, message: "IsApproved and IsPublic must be boolean values." };
    }

    // Validate linkage IDs
    // Similar checks for EventID, StatusID, UserID, LastEditUserID...

    // If all validations pass
    return { isValid: true };
  }
}

export default new ContributionsService();
