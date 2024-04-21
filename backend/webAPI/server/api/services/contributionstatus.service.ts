import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();
const model = 'roles';

export class ContributionStatus {
  all(): Promise<any> {
    const roles = prisma.contributionStatuses.findMany();
    L.info(roles, `fetch all ${model}(s)`);
    return Promise.resolve(roles);
  }

  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const role = prisma.contributionStatuses.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(role);
  }

}

export default new ContributionStatus();
