import { Faculty } from '../models/Faculty';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { ExceptionMessage, FacultyExceptionMessage } from '../common/exception';
import l from '../../common/logger';

const prisma = new PrismaClient();
const model = 'faculties';

export class FacultiesService implements ISuperService<Faculty> {
  all(depth?: number): Promise<any> {
    var select: any = {
      ID: true,
      Name: true,
      Description: true,
      IsEnabledGuest: true,
      CreatedAt: true,
      UpdatedAt: true,
    };

    if (depth == 1) {
      select.Events = { select: { ID: true, Name: true } };
      select.Users = { select: { ID: true, Name: true } };
    }
    const faculties = prisma.faculties.findMany({
      select,
    });
    L.info(faculties, `fetch all ${model}(s)`);
    return Promise.resolve(faculties);
  }
  // Filter
  byId(
    id: number,
    depth?: number,
    event?: boolean,
    user?: boolean
  ): Promise<any> {
    var select: any = {
      ID: true,
      Name: true,
      Description: true,
      IsEnabledGuest: true,
      CreatedAt: true,
      UpdatedAt: true,
    };

    if (depth == 1) {
    }

    if (event == true) {
      select.Events = {
        select: { ID: true, Name: true },
        where: { FacultyID: id },
      };
    }
    if (user == true) {
      select.Users = {
        select: { ID: true, Name: true },
        where: { FacultyID: id },
      };
    }

    L.info(`fetch ${model} with id ${id}`);
    const faculty = prisma.faculties.findUnique({
      select,
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
  async create(faculty: Faculty): Promise<any> {
    const validations = await this.validateConstraints(faculty);
    if (!validations.isValid) {
      return Promise.resolve({
        error: validations.error,
        message: validations.message,
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
    L.info(`delete ${model} with id ${id}`);
    return prisma.faculties
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
  async validateConstraints(
    faculty: Faculty
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    // Validate Name
    if (!faculty.Name || !/^[A-Za-z\s]{1,15}$/.test(faculty.Name)) {
      return {
        isValid: false,
        error: FacultyExceptionMessage.INVALID,
        message:
          'Faculty name is invalid, cannot contain numbers or special characters, and must have a maximum of 15 characters.',
      };
    }

    // Validate Description
    if (!faculty.Description || faculty.Description.length > 3000) {
      return {
        isValid: false,
        error: FacultyExceptionMessage.INVALID,
        message:
          'Faculty description is invalid or too long, with a maximum of 3000 characters.',
      };
    }

    // Validate IsEnabledGuest
    if (typeof faculty.IsEnabledGuest !== 'boolean') {
      return {
        isValid: false,
        error: FacultyExceptionMessage.INVALID,
        message: 'IsEnabledGuest must be a boolean value.',
      };
    }

    // Validate Uniquely Existing Fields
    const facultyNameExisted = await prisma.faculties.findFirst({
      where: {
        Name: faculty.Name, // Server only have 1 Marketing Manager
      },
    });
    if (facultyNameExisted) {
      return {
        isValid: false,
        error: FacultyExceptionMessage.FACULTY_NAME_EXISTED,
        message: `A ${faculty.Name} already exists.`,
      };
    }
    // If all validations pass
    return { isValid: true };
  }
}

export default new FacultiesService();
