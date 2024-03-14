import { Contribution } from './../../models/Contribution';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client'
import { Filter } from 'server/models/common/Filter';

const prisma = new PrismaClient()
const model = 'contributions';

export class ContributionsService{
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

  filter(filter: Filter): Promise<any> {
    L.info(`fetch ${model}(s) with filter`, filter);
    const contributions = prisma.contributions.findMany({
      where: {
        // TODO: Apply filter conditions
      },
    });
    return Promise.resolve(contributions);
  }

  create(contribution: Contribution): Promise<any> {
    L.info(`create ${model} with id ${contribution.ID}`);
    const createdContribution = prisma.contributions.create({
      // TODO: FIX THIS
      data: contribution,
    });
    return Promise.resolve(createdContribution);
  }

  delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    const deletedContribution = prisma.contributions.delete({
      where: { ID: id },
    });
    return Promise.resolve(deletedContribution);
  }

  update(contribution: Contribution): Promise<any> {
    L.info(`update ${model} with id ${contribution.ID}`);
    const updatedContribution = prisma.contributions.update({
      where: { ID: contribution.ID },
      data: contribution,
    });
    return Promise.resolve(updatedContribution);
  }


}

export default new ContributionsService();
