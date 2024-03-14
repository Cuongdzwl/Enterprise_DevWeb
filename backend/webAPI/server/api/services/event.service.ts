import prisma from '../../common/prisma';
import { Event } from '@prisma/client';

export class EventService {
  async createEvent(Name: string, Description: string, ClosureDate: Date, FinalDate: Date, FacultyID: number): Promise<Event> {
    return prisma.event.create({
      data: {
        Name,
        Description,
        ClosureDate,
        FinalDate,
        FacultyID,
      },
    });
  }

  async getAllEvents(): Promise<Event[]> {
    return prisma.event.findMany();
  }

  async getEventById(ID: number): Promise<Event | null> {
    return prisma.event.findUnique({
      where: { ID },
    });
  }
}

export default new EventService();
