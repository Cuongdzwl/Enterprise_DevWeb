import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { User } from '../../models/User';
import { Filter } from 'server/models/common/Filter';

const prisma = new PrismaClient();
const model = 'user';

export class UsersService {
  all(): Promise<any> {
    const users = prisma.users.findMany();
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
    // TODO: VALIDATE CONSTRAINTss
    try {
      L.info(`create ${model} with id ${user.ID}`);
      const salt =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      const createdUser = prisma.users.create({
        data: {
          Name: user.Name,
          Password: user.Password,
          Salt: salt,
          Email: user.Email,
          Phone: user.Phone,
          Address: user.Address,
          RoleID: user.RoleID,
          FacultyID: user.FacultyID,
        },
      });
      return Promise.resolve(createdUser);
    } catch (error) {
      throw new Error(`create ${model} failed: ${error}`);
    }
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
  update(id: number, user: User): Promise<any> {
    // TODO: VALIDATE CONSTRAINTs

    try {
      L.info(`update ${model} with id ${user.ID}`);
      const updatedUser = prisma.users.update({
        where: { ID: id },
        data: {
          Name: user.Name,
          Password: user.Password,
          Email: user.Email,
          Phone: user.Phone,
          Address: user.Address,
          RoleID: user.RoleID,
          FacultyID: user.FacultyID,
        },
      });
      return Promise.resolve(updatedUser);
    } catch (error) {
      throw new Error(`create ${model} failed: ${error}`);
    }
  }
}

export default new UsersService();
