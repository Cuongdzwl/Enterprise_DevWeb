import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { User } from '../models/User';
import { UserExceptionMessage } from '../common/exception';
import  NotificationService  from './notifications.service';
import { ISuperService } from '../interfaces/ISuperService.interface';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const model = 'user';

export class UsersService implements ISuperService<User> {
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
  search(field: string, key: string): Promise<any> {
    const users = prisma.users.findMany({
      where: {
        [field]: {
          contains: key,
        },
      },
    });
    L.info(users, `fetch all ${model}(s)`);
    return Promise.resolve(users);
  }
  filter(filter: string, key: string): Promise<any> {
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
    if (!this.validateConstraints(user)) {
      L.error(`create ${model} failed: invalid constraints`);
      return Promise.resolve({
        error: UserExceptionMessage.INVALID,
        message: UserExceptionMessage.BAD_REQUEST,
      });
    }
    //
    try {
      L.info(`create ${model} with id ${user.ID}`);
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let password = '';
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      // Send email
      //
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Continue with the rest of the code
      const createdUser = prisma.users.create({
        data: {
          Name: user.Name,
          Password: hashedPassword,
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
      L.error(`create ${model} failed: ${error}`);
      return Promise.reject({
        error: UserExceptionMessage.INVALID,
        message: UserExceptionMessage.BAD_REQUEST,
      });
    }
  }
  // Delete
  delete(id: number): Promise<any> {
    try {
      L.info(`delete ${model} with id ${id}`);
      const deletedUser = prisma.users.delete({
        where: { ID: id },
      });
      return Promise.resolve(deletedUser);
    } catch (error) {
      L.error(`delete ${model} failed: ${error}`);

      return Promise.resolve({
        error: UserExceptionMessage.INVALID,
        message: UserExceptionMessage.BAD_REQUEST,
      });
    }
  }
  // Update
  update(id: number, user: User): Promise<any> {
    // Validate
    if (!this.validateConstraints(user)) {
      return Promise.reject({
        error: UserExceptionMessage.INVALID,
        message: UserExceptionMessage.BAD_REQUEST,
      });
    }
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
      L.error(`update ${model} failed: ${error}`);
      return Promise.resolve({
        error: UserExceptionMessage.INVALID,
        message: UserExceptionMessage.BAD_REQUEST,
      });
    }
  }
  private async validateConstraints(user: User): Promise<boolean> {
    // TODO: VALIDATE CONSTRAINTss
    L.info(`r ${model} failed: ${user.RoleID}`);
    L.info(`f ${model} failed: ${user.FacultyID}`);
    L.info(
      `R ${model} failed: ${prisma.roles.findUnique({
        where: { ID: user.RoleID },
      })}`
    );
    L.info(
      `F ${model} failed: ${prisma.faculties.findUnique({
        where: { ID: user.FacultyID },
      })}`
    );
    if (
      (await prisma.roles.findUnique({ where: { ID: user.RoleID } })) ===
      undefined
    ) {
      L.info(user.RoleID);
      return false;
    }
    if (
      (await prisma.faculties.findUnique({ where: { ID: user.FacultyID } })) ===
      undefined
    ) {
      return false;
    }
    return true;
  }
}

export default new UsersService();
