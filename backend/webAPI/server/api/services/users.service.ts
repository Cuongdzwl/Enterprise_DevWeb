import L from '../../common/logger';
import { PrismaClient } from '@prisma/client'
import {User} from '../../models/User'
import { Filter } from 'server/models/common/Filter';

const prisma = new PrismaClient()
const model = 'user';

export class UsersService {
  all(): Promise<any> {
    const users = prisma.users.findMany()
    L.info(users, `fetch all ${model}(s)`);
    return Promise.resolve(users);
  }
  // Filter
  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    return this.all().then((r) => r[id]);
  }

  // filter(filter: Filter): Promise<any> {
  //   //TODO: filter
  //   // return
  // }
  
  // Create
  create(user: User): Promise<any> {
    L.info(`create ${model} with id ${user.ID}`);
    
    return Promise.resolve();
  }
  // Delete
  delete(id: number): void {
    L.info(`delele ${model} with id ${id}`);
    return;
  }
  // Update
  // update(user: User): Promise<any> {
  //   L.info(`update ${model} with id ${user.ID}`);
  //   // TODO: Update the user in the database
  //   // return prisma.users.update({
  //   //   // where: { ID: user.ID },
  //   //   data: user,
  //   // });
  // }

  

}

export default new UsersService();
