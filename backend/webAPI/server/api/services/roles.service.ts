import { Role } from '../models/Role';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { RoleExceptionMessage, ExceptionMessage } from '../common/exception';

const prisma = new PrismaClient();
const model = 'roles';

export class RolesService implements ISuperService<Role> {
  all(): Promise<any> {
    const roles = prisma.roles.findMany();
    L.info(roles, `fetch all ${model}(s)`);
    return Promise.resolve(roles);
  }

  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const role = prisma.roles.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(role);
  }

  filter(filter: string, key: string): Promise<any> {
    L.info(`fetch ${model}(s) with filter`, filter);
    const roles = prisma.roles.findMany({
      where: {
        [filter]: key,
      },
    });
    return Promise.resolve(roles);
  }

  create(role: Role): Promise<any> {
    if (!this.validateConstraints(role, false)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    try {
      L.info(`create ${model} with id ${role.ID}`);
      const createdRole = prisma.roles.create({
        data: {
            Name: role.Name,
            Description: role.Description,
        },
      });
      return Promise.resolve(createdRole);
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    const deletedRole = prisma.roles.delete({
      where: { ID: id },
    });
    return Promise.resolve(deletedRole);
  }

  update(id: number, role: Role): Promise<any> {
    if (!this.validateConstraints(role, true)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    try {
      L.info(`update ${model} with id ${role.ID}`);
      const updatedRole = prisma.roles.update({
        where: { ID: id },
        data: {
            Name: role.Name,
            Description: role.Description,
        },
      });
      return Promise.resolve(updatedRole);
    } catch (error) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  async validateConstraints(role: Role, update: boolean): Promise<{isValid: boolean, error?: string, message?: string}> {
    // Validate Content
    if (!role.Name || !/^[A-Za-z\s]{1,50}$/.test(role.Name)) {
        return {
          isValid: false,
          error: ExceptionMessage.INVALID,
          message:
            'Role name is invalid, cannot contain numbers or special characters, and must have a maximum of 15 characters.',
        };
      }
    const existName = await prisma.roles.findMany({
      where: {Name: Role.name}
    })
    if(existName && update == false){
      return {
        isValid: false,
        error: RoleExceptionMessage.ROLE_NAME_EXISTED,
        message:
            'This role name already exists ',
      }
    }
        // Validate Content
        if (!role.Description || role.Description .length > 3000) {
          return {
            isValid: false,
            error: RoleExceptionMessage.INVALID,
            message:
              'Description is invalid or too long, with a maximum of 3000 characters.',
          };
        }
    return { isValid: true };
}
}

export default new RolesService();
