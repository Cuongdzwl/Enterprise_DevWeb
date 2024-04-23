import { Faculty } from '../models/Faculty';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { ExceptionMessage, FacultyExceptionMessage } from '../common/exception';
import l from '../../common/logger';
import { DashBoard } from '../models/DashBoard';
import eventsService from './events.service';

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
    const events = await prisma.events.findMany({where:{FacultyID:id}})
    for (const event of events) {
      console.log(event.ID);
      await eventsService.delete(event.ID).catch((err)=>{
        L.error(`delete contributions failed: ${err}`);
      });
    }
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
      let yearlyData :  DashBoard[] =[];
      const allContributions = await prisma.faculties.findMany({
        where: {
          CreatedAt: {
            gte: new Date(startYear, 0, 1),
            lte: new Date(endYear, 11, 31),
          },
        },
      });
      for (const faculty of allContributions){
      for (let year =startYear; year <= endYear; year++){
      const contributionsOfFaculty = await prisma.contributions.count({
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
      const allContributions = await prisma.contributions.findMany({
        where: {
          Event: {
            FacultyID: faculty.ID,
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
      const contributionsFacultyAndByYear =
      totalContributionsInYear > 0
        ? (contributionsOfFaculty / totalContributionsInYear) * 100
        : 0;
      const contributionsPercentage = contributionsFacultyAndByYear
      const contributorsByFacultyAndYear = await prisma.users.count({
        where: {
          Contributions: {
            some: {
              Event: {
                FacultyID: faculty.ID,
              },
              CreatedAt: {
                gte: new Date(year, 0, 1),
                lte: new Date(year, 11, 31),
              },
            },
          },
        },
      });
      yearlyData.push(new DashBoard(
        faculty.ID,
        faculty.Name,
        year,
        contributionsOfFaculty,
        contributionsException,
        contributionsPercentage,
        contributorsByFacultyAndYear
      ));
    }
  }
      return yearlyData
    } catch (error) {
      console.error('An error occurred: ', error);
      return 'An internal server error occurred.';
    }
  }
  async dashboardManager(startYear:number, endYear:number) {
    // Validate input years
    if (!Number.isInteger(startYear) || !Number.isInteger(endYear)) {
      return "Invalid input: 'startYear' and 'endYear' must be integers.";
    }
  
    try {
      let stats = [];
      for (let year =startYear; year <= endYear; year++){
      const eventTotal = await prisma.events.count({
        where: {
          UpdatedAt: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        }
      })
      const contribution = await prisma.contributions.count({
        where: {
          CreatedAt: {
            gte: new Date(year, 0, 1),
            lte: new Date(year, 11, 31),
          },
        }
      })
      stats.push(year, eventTotal, contribution)
    }
    const formattedStats = []
    for (let i = 0; i < stats.length; i += 3) {
      // Ensure there's a pair to process
      if (stats[i + 1] !== undefined) {
          formattedStats.push({
              Year: stats[i],
              TotalEvent: stats[i + 1],
              TotalContribution: stats[i + 2]
          });
      }
  }
      return formattedStats;
    } catch (error) {
      console.error('An error occurred: ', error);
      return 'An internal server error occurred.';
    }
  }
  

  async generateReport(facultyID?: number, year?: number) {
    // If facultyID is provided, filter by facultyID
    const facultyFilter = facultyID ? { ID: facultyID } : {};
  
    // If year is provided, filter by year
    const yearFilter = year
      ? {
          CreatedAt: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1),
          },
        }
      : {};
  
    // Query the database
    const faculties = await prisma.faculties.findMany({
      where: {
        ...facultyFilter,
      },
      include: {
        Users: true,
        Events: {
          where: {
            ...yearFilter,
          },
          include: {
            Contributions: {
              include: {
                Files: true,
              },
            },
          },
        },
      },
    });
  
    // Map the data to the desired format
    const data = faculties.map((faculty) => {
      const totalEvents = faculty.Events.length;
      const totalUsers = faculty.Users.length;
      const totalStudent = faculty.Users.filter((user) => user.RoleID === 4).length;
      const totalCoordinator = faculty.Users.filter((user) => user.RoleID === 3).length;
      const totalContributions = faculty.Events.reduce(
        (sum, event) => sum + event.Contributions.length,
        0
      );
      const totalFiles = faculty.Events.reduce(
        (sum, event) =>
          sum +
          event.Contributions.reduce(
            (sum, contribution) => sum + contribution.Files.length,
            0
          ),
        0
      );
      const totalPublicContributions = faculty.Events.reduce(
        (sum, event) =>
          sum +
          event.Contributions.filter((contribution) => contribution.IsPublic)
            .length,
        0
      );
      const totalApprovedContributions = faculty.Events.reduce(
        (sum, event) =>
          sum +
          event.Contributions.filter((contribution) => contribution.IsApproved)
            .length,
        0
      );
      const totalRejectedContributions = totalContributions - totalApprovedContributions;
      const pendingContributions = totalContributions - totalApprovedContributions - totalRejectedContributions;
  
      return {
        year: year || "Life Time",
        facultyName: faculty.Name,
        totalUsers,
        totalCoordinator,
        totalStudent,
        totalEvents,
        totalContributions,
        totalFiles,
        totalPublicContributions,
        totalApprovedContributions,
        totalRejectedContributions,
        pendingContributions,
      };
    });
  
    return data;
  }


  async validateConstraints(
    faculty: Faculty
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    // Validate Name
    if (!faculty.Name || !/^[A-Za-z\s]{1,50}$/.test(faculty.Name)) {
      return {
        isValid: false,
        error: FacultyExceptionMessage.INVALID,
        message:
          'Faculty name is invalid, cannot contain numbers or special characters, and must have a maximum of 50 characters.',
      };
    }

    // Validate Description
    if (!faculty.Description || faculty.Description.length > 1000) {
      return {
        isValid: false,
        error: FacultyExceptionMessage.INVALID,
        message:
          'Faculty description is invalid or too long, with a maximum of 1000 characters.',
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
