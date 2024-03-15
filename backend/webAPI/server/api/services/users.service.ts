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
    const user = prisma.users.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(user);
  }

  filter(filter: Filter, key: string): Promise<any> {
    const users = prisma.users.findMany({
      where: {
        [filter]: key,
      },
    });
    L.info(users, `fetch all ${model}(s)`);
    return Promise.resolve(users);
  }

  // Create
  create(user: User): Promise<any> {
    
    L.info(`create ${model} with id ${user.ID}`);
    const createdUser = prisma.users.create({
      data: {
        Name: user.Name,
        Password: user.Password,
        Salt: user.Salt,
        Email: user.Email,
        Phone: user.Phone,
        Address: user.Address,
        RoleID: user.RoleID,
        FacultyID: user.FacultyID
      },
    });
    return Promise.resolve(createdUser);
  }
  // Delete
  delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    const deletedUser = prisma.users.delete({
      where: { ID: id },
    });
    return Promise.resolve(deletedUser);
  }
  // Update
  update(users: User): Promise<any> {
    L.info(`update ${model} with id ${users.ID}`);
    const updatedUser = prisma.users.update({
      where: { ID: users.ID },
      data: {
        
      },
    });
    return Promise.resolve(updatedUser);
  }

}

export default new UsersService();