import { error } from 'console';
import { Role } from './../models/Role';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { User } from '../models/User';
import { ExceptionMessage, UserExceptionMessage } from '../common/exception';
import NotificationService from './notifications.service';
import { ISuperService } from '../interfaces/ISuperService.interface';
import bcrypt from 'bcrypt';
import utils from '../common/utils';
import { UserDTO } from '../models/DTO/User.DTO';
import { NotificationSentThrough } from '../models/NotificationSentThrough';
import { NotificationSentType } from '../models/NotificationSentType';
import { Faculty } from '../models/Faculty';

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
    if (!validations.isValid) {
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
      //
      // Continue with the rest of the code
      const createdUser = await prisma.users.create({
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
      // Send email
      var faculty: Faculty | null = await prisma.faculties.findUnique({
        where: { ID: user.FacultyID },
      });
      if (!(faculty == null)) {
        const payload: any = {
          Faculty: { Name: faculty.Name },
          Name: user.Name,
          Password: password,
        };
        NotificationService.trigger(
          createdUser as User,
          payload,
          NotificationSentType.EMAILPASSWORD,
          NotificationSentThrough.Email
        );
      } else
        return Promise.reject({
          error: UserExceptionMessage.INVALID,
          message: UserExceptionMessage.INVALID_FACULTYID,
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
    L.info(`delete ${model} with id ${id}`);
    return prisma.users
      .delete({
        where: { ID: id },
      })
      .then((r) => {
        return Promise.resolve(r);
      })
      .catch((err) => {
        L.error(`delete ${model} failed: ${err}`);
        return Promise.resolve({
          error: ExceptionMessage.INVALID,
          message: ExceptionMessage.BAD_REQUEST,
        });
      });
      
  }
  // Update
  async update(id: number, user: User, updateProfile?: boolean): Promise<any> {
    L.info(`update ${model} with id ${id}`);

    const result = await prisma.users.findUnique({ where: { ID: id } });

    if (!result)
      return Promise.reject({
        error: UserExceptionMessage.INVALID,
        message: UserExceptionMessage.BAD_REQUEST,
      });

    if (user.Password) {
      var hashedPassword: string = utils.hashedPassword(
        user.Password,
        result.Salt
      );
    } else {
      hashedPassword = result.Password;
    }
    L.info(result);
    L.info(user);
    var data: any = {
      Name: user.Name,
      Password: hashedPassword,
      Email: user.Email,
      Phone: user.Phone,
      Address: user.Address,
      RoleID: user.RoleID,
      FacultyID: user.FacultyID,
    };
    L.info(data);
    L.info(result.ID + ' updated');
    if (updateProfile && updateProfile == true) {
      (data.RoleID = result.RoleID), (data.FacultyID = result.FacultyID);
    }
    const updatedUser = await prisma.users.update({
      where: { ID: id },
      data,
    });
    return Promise.resolve(new UserDTO().map(updatedUser as User));
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

      //  Validate Password
      if (user.Password) {
        if (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(user.Password)) {
          return {
            isValid: false,
            error: UserExceptionMessage.INVALID,
            message:
              'Password must be at least 8 characters long and contain both letters and numbers.',
          };
        }
      }
      // Validate Email
      if (!user.Email || !/\S+@\S+\.\S+/.test(user.Email)) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID,
          message:
            "Email must contain '@' and cannot contain other special characters.",
        };
      }

      // Validate Uniquely Existing Fields
      const userNameExisted = await prisma.users.findFirst({
        where: {
          Email: user.Email,  // Name Email only have 1 in server
        },
      });
      if (userNameExisted) {
        return {
          isValid: false,
          error: UserExceptionMessage.EMAIL_EXISTED,
          message: `A ${userNameExisted} already exists.`,
        };
      }
      
      // Validate Role ID
      if(user.RoleID === null || user.RoleID === undefined || !user.FacultyID){
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID_ROLEID,
          message: 'Role ID must be a number with a maximum of 20 digits.',
        };
      }
      if (!/^\d{1,20}$/.test(user.RoleID.toString())) {
        return {
          isValid: false,
          error: UserExceptionMessage.INVALID_ROLEID,
          message: 'Invalid Contribution ID format.',
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
      if (
        user.FacultyID != null &&
        !/^\d{1,20}$/.test(user.FacultyID.toString())
      ) {
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


          //validate role name and relationship
          if (roleExists.Name === 'Marketing Manager' || roleExists.Name === 'Marketing Coordinator' || roleExists.Name === 'Admin' || roleExists.Name === 'Student') {
            if(roleExists.Name === 'Marketing Manager'){
              const userWithRoleMarketingManager = await prisma.users.findFirst({
                where: {
                  RoleID: user.RoleID,  // Server only have 1 Marketing Manager
                },
              });
              if (userWithRoleMarketingManager) {
                return {
                  isValid: false,
                  error: UserExceptionMessage.ROLE_ALREADY_ASSIGNED_IN_SEVER,
                  message: `A ${roleExists.Name} already exists in this server.`,
                };
              }
            }
            if(roleExists.Name === 'Marketing Coordinator'){
    
            const userWithRoleInFaculty = await prisma.users.findFirst({
              where: {
                RoleID: user.RoleID,
                FacultyID: user.FacultyID, // Faculty only have 1 Marketing Coordinator
              },
            });
            if (userWithRoleInFaculty) {
              return {
                isValid: false,
                error: UserExceptionMessage.ROLE_ALREADY_ASSIGNED_IN_FACULTY,
                message: `A ${roleExists.Name} already exists in this faculty.`,
              };
            }
          }
          } else {
            return {
              isValid: false,
              error: UserExceptionMessage.INVALID_FACULTYID,
              message: 'Role name must be belong to the allowed names like Marketing Manager , Marketing Coordinator , Admin , Student.',
            };
          };
    
      // If all validations pass
      return { isValid: true };
    }
  }
  async validateConstraintsForPassword(
    user: User
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    //validate password
    if (!user.Password){
      if (!/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(user.Password)) {
          return {
            isValid: false,
            error: UserExceptionMessage.INVALID,
            message:
              'Password must be at least 8 characters long and contain both letters and numbers.',
          };
        }
      }
     return { isValid: true };}
}

export default new UsersService();
