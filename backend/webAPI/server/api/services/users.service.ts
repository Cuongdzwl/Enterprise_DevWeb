import { Role } from './../models/Role';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { User } from '../models/User';
import { UserExceptionMessage } from '../common/exception';
import NotificationService from './notifications.service';
import { ISuperService } from '../interfaces/ISuperService.interface';
import utils from '../common/utils';

const prisma = new PrismaClient();
const model = 'user';

export class UsersService implements ISuperService<User> {
  all(depth?: number): Promise<any> {
    var select: any = {
      ID: true,
      Name: true,
      Email: true,
      Phone: true,
      Address: true,
      CreatedAt: true,
      UpdatedAt: true,
      RoleID: true,
      FacultyID: true,
    };
    if (depth == 1) {
      select.Faculty = { select: { ID: true, Name: true } };
      select.Role = { select: { ID: true, Name: true } };
    }
    const users = prisma.users.findMany({
      select,
    });
    L.info(`fetch all ${model}(s)`);
    return Promise.resolve(users);
  }
  // Filter
  byId(id: number, depth?: number): Promise<any> {
    var select: any = {
      ID: true,
      Name: true,
      Email: true,
      Phone: true,
      Address: true,
      CreatedAt: true,
      UpdatedAt: true,
      RoleID: true,
      FacultyID: true,
    };
    if (depth == 1) {
      select.Faculty = { select: { ID: true, Name: true } };
      select.Role = { select: { ID: true, Name: true } };
    }
    L.info(`fetch ${model} with id ${id}`);
    const user = prisma.users.findUnique({
      select,
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
  async create(user: User): Promise<any> {
    const validations = await this.validateConstraints(user);
    if(!validations.isValid){
      L.error(`create ${model} failed: invalid constraints`);
    return Promise.resolve({
      error: validations.error,
      message: validations.message,
    });
    }
    try {
      L.info(`create ${model} with id ${user.ID}`);

      var password: string = utils.generatePassword();
      L.info(`create ${model} with password ${password}`);
      var salt: string = utils.generateSalt();
      var hashedPassword: string = utils.hashedPassword(password, salt);

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
  async update(id: number, user: User): Promise<any> {
    L.info(`update ${model} with id ${id}`);
    this.byId(id)
      .then((result: User) => {
        if (user.Password) {
          var hashedPassword: string = utils.hashedPassword(
            user.Password,
            result.Salt
          );
        } else {
          hashedPassword = result.Password;
        }
        var data: any = {
          Name: user.Name,
          Password: hashedPassword,
          Email: user.Email,
          Phone: user.Phone,
          Address: user.Address,

        }
        if(result.RoleID == 1){
            data.RoleID = result.RoleID;
            data.FacultyID = result.FacultyID;
        }
        const updatedUser = prisma.users.update({
          where: { ID: id },
          data,
        });
        return Promise.resolve(updatedUser);
      })
      .catch(() => {
        return Promise.resolve({
          error: UserExceptionMessage.INVALID,
          message: UserExceptionMessage.BAD_REQUEST,
        });
      });
    }
    
  async validateConstraints(
    user: User
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    {
      // Validate Name
      if (!user.Name || !/^[A-Za-z\s]{1,15}$/.test(user.Name)) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID,
          message:
            'User name is invalid, cannot contain numbers or special characters, and must have a maximum of 15 characters.',
        };
      }

      // // Validate Password
      // if (
      //   !user.Password ||
      //   !/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(user.Password)
      // ) {
      //   return {
      //     isValid: false,
      //     error: UserExceptionMessage.INVALID,
      //     message:
      //       'Password must be at least 8 characters long and contain both letters and numbers.',
      //   };
      // }

      // // Validate Salt
      // if (!user.Salt || !/^[a-z\d]{1,26}$/.test(user.Salt)) {
      //   return {
      //     isValid: false,
      //     error: UserExceptionMessage.INVALID,
      //     message:
      //       'Salt is invalid, must be a string of random lowercase letters and numbers, maximum of 26 characters.',
      //   };
      // }

      // Validate Email
      if (!user.Email || !/\S+@\S+\.\S+/.test(user.Email)) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID,
          message:
            "Email must contain '@' and cannot contain other special characters.",
        };
      }

      // Validate Role ID
      if (!/^\d{1,20}$/.test(user.RoleID.toString())) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID_ROLEID,
          message: 'Role ID must be a number with a maximum of 20 digits.',
        };
      }

      const roleExists = await prisma.roles.findUnique({
        where: { ID: user.RoleID },
      });
      if (!roleExists) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID_ROLEID,
          message: 'Referenced Role does not exist.',
        };
      }

        // Validate Faculty ID
        if (!/^\d{1,20}$/.test(user.FacultyID.toString())) {
          return {
            isValid: false,
            error: UserExceptionMessage.INVALID_FACULTYID,
            message: 'Faculty ID must be a number with a maximum of 20 digits.',
          };
        }
  
        const facultyexists = await prisma.faculties.findUnique({
          where: { ID: user.FacultyID },
        });
        if (!facultyexists) {
          return {
            isValid: false,
            error: UserExceptionMessage.INVALID_FACULTYID,
            message: 'Referenced Faculty does not exist.',
          };
        }

      // Validate Phone
      if (user.Phone && !/^\d{1,15}$/.test(user.Phone)) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID,
          message:
            'Phone can only contain numbers, with a maximum of 15 digits.',
        };
      }

      // Validate Address
      if (user.Address && user.Address.length > 300) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID,
          message:
            'Address cannot be longer than 300 characters and cannot contain special characters.',
        };
      }
      // Validate Address
      if (user.Address && user.Address.length > 300) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID,
          message:
            'Address cannot be longer than 300 characters and cannot contain special characters.',
        };
      }

      // If all validations pass
      return { isValid: true };
    }
  }
}

export default new UsersService();
