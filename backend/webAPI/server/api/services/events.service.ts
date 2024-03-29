import { Event } from '../models/Event';
import L from '../../common/logger';
import { EventExceptionMessage } from '../common/exception';
import { PrismaClient } from '@prisma/client';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { error } from 'console';
import notificationsService from './notifications.service';
import usersService from './users.service';

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

  byId(id: number, depth?: number, contribution?: boolean): Promise<any> {
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
    };

    if (depth == 1) {
      select.Faculty = { select: { ID: true, Name: true } };
    }
    if (contribution == true) {
      select.Contributions = {
        select: {
          ID: true,
          Name: true,
          Content: true,
          StatusID: true,
          Files: {
            select: { ID: true, Url: true },
            where: { ContributionID: id },
          },
          Status: { select:{ID: true, Name: true} },
        },
        where: { EventID: id },
      };
    }

    return prisma.events
      .findUnique({
        select,
        where: { ID: id },
      })
      .then((r) => {
        L.info(`fetch ${model} with id ${id}`);
        return Promise.resolve(r);
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }
  filter(filter: string, key: string): Promise<any> {
    const events = prisma.events.findMany({
      where: {
        [filter]: key,
      },
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

    L.info(`create ${model} with id ${event.ID}`);
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
      .then((r) => {
        if (r) {
          usersService
            .filter('FacultyID', r.FacultyID + '')
            .then(() => {
              // send notify
              // notificationsService.bulkTrigger();
            })
            .catch((_) => {});
        }
        return Promise.resolve(r);
      })
      .catch((_) => {
        L.error(`create ${model} failed: ${error}`);
        return Promise.reject({
          error: EventExceptionMessage.INVALID,
          message: EventExceptionMessage.INVALID,
        });
      });
  }
  delete(id: number): Promise<any> {
    try {
      L.info(`delete ${model} failed: ${error}`);
      const deletedEvent = prisma.events.delete({
        where: { ID: id },
      });
      return Promise.resolve(deletedEvent);
    } catch (error) {
      L.error(`delete ${model} failed: ${error}`);
      return Promise.reject({
        error: EventExceptionMessage.INVALID,
        message: EventExceptionMessage.NOT_FOUND,
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
      const createdEvent = prisma.events.update({
        where: { ID: id },
        data: {
          Name: event.Name,
          Description: event.Description,
          ClosureDate: event.ClosureDate,
          FinalDate: event.FinalDate,
          FacultyID: event.FacultyID,
        },
      });
      return Promise.resolve(createdEvent);
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);
      return Promise.reject({
        error: EventExceptionMessage.INVALID,
        message: EventExceptionMessage.INVALID,
      });
    }
  }

  async validateConstraints(
    event: Event
  ): Promise<{ isValid: boolean; error?: string; message?: string }> {
    // Validate Name
    if (!event.Name || !/^[A-Za-z\s]{1,15}$/.test(event.Name)) {
      return {
        isValid: false,
        error: EventExceptionMessage.INVALID,
        message:
          'Event name is invalid, cannot contain numbers or special characters, and must have a maximum of 15 characters.',
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
