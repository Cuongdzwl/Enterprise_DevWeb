import { Faculty } from '../models/Faculty';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { ExceptionMessage, FacultyExceptionMessage } from '../common/exception';
import l from '../../common/logger';
import { Report } from '../models/Report';

const prisma = new PrismaClient();
const model = 'faculties';

export class FacultiesService implements ISuperService<Faculty> {
  all(depth?: number,user?: boolean, isPublic?: boolean,publicEventId?: number): Promise<any> {
    var select: any = {
      ID: true,
      Name: true,
      Description: true,
      IsEnabledGuest: true,
      CreatedAt: true,
      UpdatedAt: true,
    };
    // depth 1 is for public faculties
    if (depth == 1) {
      select.Events = { select: { ID: true, Name: true ,Description : true } };
      if(user == true)
        select.Users = { select: { ID: true, Name: true } };
    }
    if (isPublic) { 
      var where: any = { IsEnabledGuest: true };
      // depth 2 is for public events         
      if(depth == 2)
      if(publicEventId){
        select.Events = {
          select: { ID: true, Name: true ,Description : true ,CreatedAt : true, UpdatedAt : true, FacultyID : true
          },
          where: { FacultyID: publicEventId }
        };
      }
    } else {
      var where = undefined;
    }
    const faculties = prisma.faculties.findMany({
      select,
      where,
    });
    L.info(faculties, `fetch all ${model}(s)`);
    return Promise.resolve(faculties);
  }
  // Filter
  byId(
    id: number,
    depth?: number,
    event?: boolean,
    user?: boolean,
    isPublic?: boolean
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
    var where: any = { FacultyID: id };
    if (isPublic) {
      where.IsEnabledGuest = true;
    }

    if (event == true) {
      select.Events = {
        select: { ID: true, Name: true },
        where,
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
  async dashboard(facultyID: number, year: number){
  // Validate input
  if (!Number.isInteger(facultyID) || !Number.isInteger(year)) {
    return "Invalid input: 'facultyID' and 'year' must be integers.";
  }

  try {
    const contributionsOfFaculty = await prisma.contributions.count({
      where: {
        Event: {
          FacultyID: facultyID,
          CreatedAt: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        },
      },
    });

const allContributions = await prisma.contributions.findMany({
  where: {
    Event: {
      FacultyID: facultyID,
      CreatedAt: {
        gte: new Date(year, 0, 1),
        lte: new Date(year, 11, 31),
      },
    },
  },
  include: {
    Event: true, 
    Comments: true, 
  }
});
const contributionsException = allContributions.filter(contribution => {
  if (contribution.Comments.length == 0) {
    console.log(1)
    const createdDate = new Date(contribution.CreatedAt);
    const closureDate = new Date(contribution.Event.ClosureDate);
    console.log(createdDate)
    console.log(closureDate)
    const limitDate = new Date(closureDate.setDate(closureDate.getDate() + 14));
    console.log(limitDate)
    return new Date() > limitDate;
  }
  return false;
}).length;

    const totalContributionsInYear = await prisma.contributions.count({
      where: {
        Event: {
          CreatedAt: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        },
      },
    });

    const contributionsFacultyAndByYear = totalContributionsInYear > 0
      ? (contributionsOfFaculty / totalContributionsInYear * 100)
      : 0;

    const contributorsByFacultyAndYear = await prisma.users.count({
      where: {
        Contributions: {
          some: {
            Event: {
              FacultyID: facultyID,
              CreatedAt: {
                gte: new Date(year, 0, 1),
                lte: new Date(year, 11, 31),
              },
            },
          },
        },
      },
    });
    return new Report(contributionsOfFaculty, contributionsException, contributionsFacultyAndByYear, contributorsByFacultyAndYear);
  } catch (error) {
    console.error("An error occurred: ", error);
    return "An internal server error occurred.";
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
