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

  create(contribution: Contribution): Promise<any> {
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

  update(id: number ,contribution: Contribution): Promise<any> {
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

  private validateConstraints(contribution: Contribution): boolean {
    if (
      prisma.contributionStatuses.findUnique({
        where: { ID: contribution.StatusID },
      }) === undefined
    )
      return false;

    if (
      prisma.events.findUnique({ where: { ID: contribution.EventID } }) ===
      undefined
    )
      return false;

    if (
      prisma.users.findUnique({ where: { ID: contribution.UserID } }) ===
      undefined
    )
      return false;

    return true;
  }
}

export default new ContributionsService();
