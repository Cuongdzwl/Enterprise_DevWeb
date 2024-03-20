import { Faculty } from '../models/Faculty';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { ExceptionMessage } from '../common/exception';
import l from '../../common/logger';

const prisma = new PrismaClient();
const model = 'faculties';

export class FacultiesService implements ISuperService<Faculty> {
  all(): Promise<any> {
    const faculties = prisma.faculties.findMany();
    L.info(faculties, `fetch all ${model}(s)`);
    return Promise.resolve(faculties);
  }
  // Filter
  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const faculty = prisma.faculties.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(faculty);
  }

  filter(filter: string, key: string): Promise<any> {
    const faculties = prisma.faculties.findMany({
      where: {
        [filter]: key,
      },
    });
    L.info(faculties, `fetch all ${model}(s)`);
    return Promise.resolve(faculties);
  }

  // Create
  create(faculty: Faculty): Promise<any> {
    if (!this.validateConstraints(faculty)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    L.info(`create ${model}`);
    const created = prisma.faculties.create({
      data: {
        Name: faculty.Name,
        Description: faculty.Description,
        IsEnabledGuest: faculty.IsEnabledGuest,
      },
    });
    return Promise.resolve(created);
  }
  // Delete
  delete(id: number): Promise<any> {
    try {
      L.info(`delete ${model} with id ${id}`);
      const deletedUser = prisma.faculties.delete({
        where: { ID: id },
      });
      return Promise.resolve(deletedUser);
    } catch (error) {
      L.error(`delete ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  // Update
  update(id: number, faculty: Faculty): Promise<any> {
    if (!this.validateConstraints(faculty)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    try {
      L.info(`update ${model} with id ${faculty.ID}`);
      const updatedFaculty = prisma.faculties.update({
        where: { ID: id },
        data: {
          Name: faculty.Name,
          Description: faculty.Description,
          IsEnabledGuest: faculty.IsEnabledGuest,
        },
      });
      return Promise.resolve(updatedFaculty);
    } catch (error) {
      L.error(`update ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  private validateConstraints(faculty: Faculty): boolean {
    if (!faculty.Name) {
      return false;
    }
    return true;
  }
}

export default new FacultiesService();
