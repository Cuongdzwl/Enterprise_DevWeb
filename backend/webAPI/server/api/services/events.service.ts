import { Event } from '../models/Event';
import L from '../../common/logger';
import { EventExceptionMessage, ExceptionMessage } from '../common/exception';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import notificationsService from './notifications.service';
import usersService from './users.service';
import { User } from '../models/User';
import { NotificationSentTypeEnum } from '../models/NotificationSentType';
import { NotificationSentThrough } from '../models/NotificationSentThrough';
import { TransactionDTO } from '../models/DTO/TransactionDTO';
import { Notification } from '../models/Notification';
import contributionsService from '../services/contributions.service';
import { Contribution } from '../models/Contribution';

const prisma = new PrismaClient();
const model = 'event';
export class EventsService implements ISuperService<Event> {
  all(depth?: number): Promise<any> {
    var select: any = {
      ID: true,
      Name: true,
      Description: true,
      ClosureDate: true,
      FinalDate: true,
      CreatedAt: true,
      UpdatedAt: true,
      FacultyID: true,
    };

    if (depth == 1) {
      select.Faculty = { select: { ID: true, Name: true } };
    }
    const events = prisma.events.findMany({
      select,
    });
    L.info(events, `fetch all ${model}(s)`);
    return Promise.resolve(events);
  }

  async byId(
    id: number,
    depth?: number,
    contribution?: boolean,
    isPublic?: boolean,
    userid?: number
  ): Promise<any> {
    L.info(id + '');
    var select: any = {
      ID: true,
      Name: true,
      Description: true,
      ClosureDate: true,
      FinalDate: true,
      CreatedAt: true,
      UpdatedAt: true,
      FacultyID: true,
      Contributions: contribution
        ? {
            select: {
              ID: true,
              Name: true,
              Content: true,
              StatusID: true,
              Files: {
                select: {
                  ID: true,
                  Url: true,
                  CreatedAt: true,
                  UpdatedAt: true,
                  ContributionID: true,
                },
              },
              Status: { select: { ID: true, Name: true } },
            },
          }
        : undefined,
    };

    if (depth == 1) {
      select.Faculty = { select: { ID: true, Name: true } };
    }

    var where: any = { ID: id };
    if (userid) {
      where.FacultyID = await prisma.users
        .findUnique({ select: { FacultyID: true }, where: { ID: userid } })
        .then((r) => {
          return r?.FacultyID;
        });
    }
    // categorize files
    if (depth == 1 && contribution == true) {
      let option: any = {};
      if (userid) {
        // option.FacultyID = await prisma.users
        //   .findUnique({ select: { FacultyID: true }, where: { ID: userid } })
        //   .then((r) => {
        //     return r?.FacultyID;
        //   });
        option.UserID = userid;
      }
      if (isPublic) {
        option.IsPublic = isPublic;
      }
      try {
        const eventContributions = await prisma.events.findUnique({
          select: {
            ID: true,
            Name: true,
            Description: true,
            ClosureDate: true,
            FinalDate: true,
            CreatedAt: true,
            UpdatedAt: true,
            FacultyID: true,
            Contributions: {
              select: {
                ID: true,
                Name: true,
                Content: true,
                StatusID: true,
                UserID: true,
                Files: {
                  select: {
                    ID: true,
                    Url: true,
                    CreatedAt: true,
                    UpdatedAt: true,
                    ContributionID: true,
                  },
                },
                Status: { select: { ID: true, Name: true } },
              },
              where: option,
            },
          },
          where,
        });
        //  Categorize file
        if (eventContributions && eventContributions.Contributions) {
          const contributionsWithFiles = await Promise.all(
            eventContributions.Contributions.map(async (contribution) => {
              const allFiles = contribution.Files;
              const filesAsDTOs = contributionsService.toFileDTOArray(allFiles);
              const { textFiles, imageFiles } =
                contributionsService.classifyFiles(filesAsDTOs);

              return Promise.resolve({
                ...contribution,
                TextFiles: textFiles,
                ImageFiles: imageFiles,
              });
            })
          );
          return Promise.resolve({
            ...eventContributions,
            Contributions: contributionsWithFiles,
          });
        }
      } catch (error) {
        L.error(`Failed to fetch event with id ${id}: ${error}`);
        Promise.reject({
          message: `Failed to fetch event with id ${id}}`,
        });
      }
    }
    // Fectch
    return await prisma.events
      .findUnique({
        select,
        where,
      })
      .then((event) => {
        return Promise.resolve(event);
      })
      .catch((error) => {
        L.error(`Failed to fetch event with id ${id}: ${error}`);
        return Promise.reject({
          message: `Failed to fetch event with id ${id}`,
        });
      });
  }

  filter(filter: string, key: string): Promise<any> {
    const events = prisma.events
      .findMany({
        where: {
          [filter]: key,
        },
      })
      .catch((error) => {
        L.error(`Failed to fetch events: ${error}`);
      });
    L.info(events, `fetch all ${model}(s)`);
    return Promise.resolve(events);
  }
  async create(event: Event): Promise<any> {
    const validations = await this.validateConstraints(event);
    if (!validations.isValid) {
      L.error(`create ${model} failed: invalid constraints`);
      return Promise.resolve({
        error: validations.error,
        message: validations.message,
      });
    }
    return prisma.events
      .create({
        data: {
          Name: event.Name,
          Description: event.Description,
          ClosureDate: event.ClosureDate,
          FinalDate: event.FinalDate,
          FacultyID: event.FacultyID,
        },
      })
      .then((event) => {
        return this.schedule(event);
      })
      .catch((error) => {
        L.error(`create ${model} failed: ${error}`);
        return Promise.reject({
          error: EventExceptionMessage.INVALID,
          message: EventExceptionMessage.INVALID,
        });
      });
  }
  async delete(id: number): Promise<any> {
    try {
      L.info(`delete ${model} with id ${id}`);
      L.info(`delete ${model} with id ${id}`);
      const contributions = await prisma.contributions.findMany({
        where: { EventID: id },
      });
      for (const contribution of contributions) {
        console.log(contribution.ID);
        await contributionsService.delete(contribution.ID);
      }
      await prisma.scheduledNotifications.deleteMany({
        where: { EventID: id },
      });
      return prisma.events
        .delete({
          where: { ID: id },
        })
        .then((r) => {
          return Promise.resolve(r);
        });
    } catch (error) {
      L.error(`delete ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  async update(id: number, event: Event): Promise<any> {
    const validations = await this.validateConstraints(event);
    if (!validations.isValid) {
      L.error(`update ${model} failed: invalid constraints`);
      return Promise.resolve({
        error: validations.error,
        message: validations.message,
      });
    }
    try {
      L.info(`update ${model} with id ${event.ID}`);
      return prisma.events
        .update({
          where: { ID: id },
          data: {
            Name: event.Name,
            Description: event.Description,
            ClosureDate: event.ClosureDate,
            FinalDate: event.FinalDate,
            FacultyID: event.FacultyID,
          },
        })
        .then((event) => {
          // cancel previous notifications
          prisma.scheduledNotifications
            .findMany({
              select: { TransactionID: true },
              where: { EventID: id, IsCancelled: false },
            })
            .then(async (notifications) => {
              if (notifications != null) {
                L.info(`bulk cancel ${notifications.length} notifications`);
                var transactions: string[] = notifications.map((n) =>
                  n.TransactionID == null ? '' : n.TransactionID
                );
                L.info(transactions);
                await notificationsService.bulkCancel(transactions);
              }
            })
            .then(() => {
              this.schedule(event);
            })
            .catch((e) => {
              Promise.reject({
                isSuccess: false,
                error: e,
                message: ExceptionMessage.BAD_REQUEST,
              });
            });

          return Promise.resolve({ isSuccess: true });
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);
      return Promise.reject({
        error: EventExceptionMessage.INVALID,
        message: EventExceptionMessage.INVALID,
      });
    }
  }

  private schedule(event: Event) {
    if (event) {
      L.info(`create ${model} with id ${event.ID}`);
      prisma.users
        .findMany({ where: { FacultyID: event.FacultyID } })
        .then((users: any) => {
          if (users) var user: User[] = users;
          else return false;
          // InApp Notify
          notificationsService.bulkTrigger(
            user,
            {
              Event: {
                Name: event.Name,
                FinalDate: event.FinalDate,
                ID: event.ID,
              },
            },
            NotificationSentTypeEnum.NEWEVENT,
            NotificationSentThrough.InApp
          );
          // Scheduled Email Due Date
          notificationsService
            .bulkTrigger(
              users,
              {
                Event: {
                  Name: event.Name,
                  ID: event.ID,
                  ClosureDate: event.ClosureDate.toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }),
                  ClosureTime: event.ClosureDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  }),
                },
                Name: event.Name,
                sendAt: event.ClosureDate.toISOString(),
              },
              NotificationSentTypeEnum.CLOSUREDATE,
              NotificationSentThrough.Email
            )
            .then((rr) => {
              L.info(rr);
            });
          // Scheduled Email Final Date
          notificationsService
            .bulkTrigger(
              users,
              {
                Event: {
                  ID: event.ID,
                  Name: event.Name,
                },
                Name: event.Name,
                sendAt: event.FinalDate.toISOString(),
              },
              NotificationSentTypeEnum.FINALDATE,
              NotificationSentThrough.Email
            )
            .then((r) => {
              L.info(r);
            });
          return true;
        })
        .catch((error) => {
          L.error(error);
        });
    }
    return Promise.resolve(event);
  }

  async validateConstraints(
    event: Event
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    // Validate Name
    if (!event.Name || !/^[A-Za-z\s]{1,50}$/.test(event.Name)) {
      return {
        isValid: false,
        error: EventExceptionMessage.INVALID,
        message:
          'Event name is invalid, cannot contain numbers or special characters, and must have a maximum of 50 characters.',
      };
    }

    // Validate ClosureDate and FinalDate
    if (!event.ClosureDate || !event.FinalDate) {
      return {
        isValid: false,
        error: EventExceptionMessage.INVALID,
        message: 'Dates must be valid dates.',
      };
    }

    if (new Date(event.ClosureDate) >= new Date(event.FinalDate)) {
      return {
        isValid: false,
        error: EventExceptionMessage.INVALID,
        message: 'Closure date must be before final date.',
      };
    }

    // Validate FacultyID by checking if the referenced faculty exists
    if (
      event.FacultyID === null ||
      event.FacultyID === undefined ||
      !event.FacultyID
    ) {
      return {
        isValid: false,
        error: EventExceptionMessage.INVALID_FACULTYID,
        message: 'Faculty ID must be a number with a maximum of 20 digits.',
      };
    }
    if (!/^\d{1,20}$/.test(event.FacultyID.toString())) {
      return {
        isValid: false,
        error: EventExceptionMessage.INVALID_FACULTYID,
        message: 'Invalid Faculty ID format.',
      };
    }
    const facultyExists = await prisma.faculties.findUnique({
      where: { ID: event.FacultyID },
    });
    if (!facultyExists) {
      return {
        isValid: false,
        error: EventExceptionMessage.INVALID_FACULTYID,
        message: 'Referenced faculty does not exist.',
      };
    }

    // If all validations pass
    return { isValid: true };
  }
}

export default new EventsService();
