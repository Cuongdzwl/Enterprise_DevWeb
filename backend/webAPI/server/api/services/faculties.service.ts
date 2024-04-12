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
  all(depth?: number, user?: boolean, isPublic?: boolean): Promise<any> {
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
      select.Events = { select: { ID: true, Name: true, Description: true } };
      if (user == true) select.Users = { select: { ID: true, Name: true } };
    }
    if (isPublic) {
      var where: any = { IsEnabledGuest: true };
      // depth 2 is for public events
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
  async byId(
    id: number,
    depth?: number,
    event?: boolean,
    user?: boolean,
    isPublic?: boolean,
    contributionid?: number
  ): Promise<any> {
    var select: any = {
      ID: true,
      Name: true,
      Description: true,
      IsEnabledGuest: true,
      CreatedAt: true,
      UpdatedAt: true,
    };
    var where: any = { ID: id };
    if (isPublic) {
      where.IsEnabledGuest = true;
    }
    if (depth == 1) {
      if (user == true && isPublic == false) {
        select.Users = {
          select: { ID: true, Name: true },
          where: { FacultyID: id },
        };
      }
      if (event == true && isPublic == false) {
        // Get detail public contribution
        select.Events = {
          select: {
            ID: true,
            Name: true,
            Description: true,
            CreatedAt: true,
            UpdatedAt: true,
            FacultyID: true,
          },
          where: { FacultyID: id },
        };
      }
    }
    if (depth == 2) {
      // Get public contributions
      if (isPublic && isPublic == true) {
        L.info(`fetch public faculties events with id ${id}`);
        const events = await prisma.events.findMany({
          select: {
            ID: true,
          },
          where: {
            FacultyID: id,
            Faculty: { IsEnabledGuest: true },
          },
        });

        const eventIDs = events.map((event) => event.ID);

        const contributions = prisma.contributions.findMany({
          select: {
            ID: true,
            Name: true,
            Content: true,
            Event: { select: { ID: true, Name: true } },
            User: { select: { ID: true, Name: true } },
            Files: { select: { ID: true, Url: true } },
          },
          where: {
            AND: [
              { IsPublic: true },
              {
                EventID: {
                  in: eventIDs,
                },
              },
            ],
          },
        });
        return Promise.resolve(contributions);
      }
    }
    if (depth == 3) {
      if (contributionid && isPublic && isPublic == true) {
        L.info(`fetch public contribution with id ${contributionid}`);
        const events = await prisma.events.findMany({
          select: {
            ID: true,
          },
          where: {
            FacultyID: id,
            Faculty: { IsEnabledGuest: true },
          },
        });

        const eventIDs = events.map((event) => event.ID);

        const contributions = prisma.contributions
          .findMany({
            where: {
              AND: [
                { ID: contributionid },
                { IsPublic: true },
                {
                  EventID: {
                    in: eventIDs,
                  },
                },
              ],
            },
          })
          .catch((error) => {
            return Promise.reject(error);
          });
        return Promise.resolve(contributions);
      }
    }

    L.info(`fetch ${model} with id ${id}`);
    const faculty = prisma.faculties.findUnique({
      select,
      where,
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
  async delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    await prisma.users.deleteMany({where:{FacultyID:id}})
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
    L.info(`update ${model} with id ${faculty.ID}`);
    return prisma.faculties
      .update({
        where: { ID: id },
        data: {
          Name: faculty.Name,
          Description: faculty.Description,
          IsEnabledGuest: faculty.IsEnabledGuest,
        },
      })
      .then((r) => {
        return Promise.resolve(r);
      })
      .catch((error) => {
        L.error(`update ${model} failed: ${error}`);
        return Promise.reject({
          error: ExceptionMessage.INVALID,
          message: ExceptionMessage.BAD_REQUEST,
        });
      });
  }
  async dashboard(facultyID: number, startYear: number, endYear: number) {
    // Validate input
    try {
      if (!Number.isInteger(facultyID) || !Number.isInteger(startYear) || !Number.isInteger(endYear)) {
        return "Invalid input: 'facultyID' and 'year' must be integers.";
      }
      let yearlyData :  Report[] =[];
      console.log(endYear)
      console.log(facultyID)
      for (let year =startYear; year <= endYear; year++){
      let contributionsPercentages: { [facultyId: number]: number } = {};
      const contributionsOfFaculty = await prisma.contributions.count({
        where: {
          Event: {
            FacultyID: facultyID,
          },
          CreatedAt: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        },
      });
      console.log(contributionsOfFaculty)
      const allContributions = await prisma.contributions.findMany({
        where: {
          Event: {
            FacultyID: facultyID,
          },
          CreatedAt: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        },
        include: {
          Event: true,
          Comments: true,
        },
      });
      console.log(allContributions)
      const contributionsException = allContributions.filter((contribution) => {
        if (contribution.Comments.length == 0) {
          const createdDate = new Date(contribution.CreatedAt);
          const closureDate = new Date(contribution.Event.ClosureDate);
          const limitDate = new Date(
            closureDate.setDate(closureDate.getDate() + 14)
          );
          return new Date() > limitDate;
        }
        return false;
      }).length;

      const totalContributionsInYear = await prisma.contributions.count({
        where: {
          CreatedAt: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        },
      });
      const allFaculties = await prisma.faculties.findMany({
        select: {
          ID: true,
        },
      });
      for (const faculty of allFaculties) {
        const contributionsEveryFaculty = await prisma.contributions.count({
          where: {
            Event: {
              FacultyID: faculty.ID,
            },
            CreatedAt: {
              gte: new Date(year, 0, 1),
              lte: new Date(year, 11, 31),
            },
          },
        });
      const contributionsFacultyAndByYear =
        totalContributionsInYear > 0
          ? (contributionsEveryFaculty / totalContributionsInYear) * 100
          : 0;
          contributionsPercentages[faculty.ID] = contributionsFacultyAndByYear
      }
      const contributorsByFacultyAndYear = await prisma.users.count({
        where: {
          Contributions: {
            some: {
              Event: {
                FacultyID: facultyID,
              },
              CreatedAt: {
                gte: new Date(year, 0, 1),
                lte: new Date(year, 11, 31),
              },
            },
          },
        },
      });
      yearlyData.push(new Report(
        year,
        contributionsOfFaculty,
        contributionsException,
        contributionsPercentages, // Make sure this is an object { [facultyId: number]: number }
        contributorsByFacultyAndYear
      ));
    }
      return yearlyData
    } catch (error) {
      console.error('An error occurred: ', error);
      return 'An internal server error occurred.';
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
    if (!faculty.ID) {
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
    }
    // If all validations pass
    return { isValid: true };
  }
}

export default new FacultiesService();
