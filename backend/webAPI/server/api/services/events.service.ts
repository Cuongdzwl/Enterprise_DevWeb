import { Status } from '../models/Status';
import { Event } from '../models/Event';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { ExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';

const prisma = new PrismaClient();
const model = 'events';

export class EventsService implements ISuperService<Event> {
  all(): Promise<any> {
    const events = prisma.events.findMany();
    L.info(events, `fetch all ${model}(s)`);
    return Promise.resolve(events);
  }

  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const event = prisma.events.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(event);
  }

  filter(filter: string, key: string): Promise<any> {
    L.info(`fetch ${model}(s) with filter`, filter);
    const events = prisma.events.findMany({
      where: {
        [filter]: key,
      },
    });
    return Promise.resolve(events);
  }

  create(event: Event): Promise<any> {
    try {
      if (!this.validateConstraints(event)) {
        return Promise.resolve({
          error: ExceptionMessage.INVALID,
          message: ExceptionMessage.BAD_REQUEST,
        });
      }
      L.info(`create ${model} with id ${event.ID}`);
      const createdEvent = prisma.events.create({
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

      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  delete(id: number): Promise<any> {
    try {
      L.info(`delete ${model} with id ${id}`);
      const deletedEvent = prisma.events.delete({
        where: { ID: id },
      });
      return Promise.resolve(deletedEvent);
    } catch (error) {
      L.error(`delete ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  update(id: number, event: Event): Promise<any> {
    try {
      if (!this.validateConstraints(event)) {
        return Promise.resolve({
          error: ExceptionMessage.INVALID,
          message: ExceptionMessage.BAD_REQUEST,
        });
      }
      L.info(`update ${model} with id ${event.ID}`);
      const updatedEvent = prisma.events.update({
        where: { ID: id },
        data: {
          Name: event.Name,
          Description: event.Description,
          ClosureDate: event.ClosureDate,
          FinalDate: event.FinalDate,
          FacultyID: event.FacultyID,
        },
      });
      return Promise.resolve(updatedEvent);
    } catch (error) {
      L.error(`update ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  private validateConstraints(event: Event): boolean {
    if (
      prisma.faculties.findUnique({
        where: { ID: event.FacultyID },
      }) === undefined
    )
      return false;
    return true;
  }
}

export default new EventsService();
