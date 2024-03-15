import prisma from '../../common/prisma';
import { events } from '@prisma/client';

export class EventService {
  async createEvent(Name: string, Description: string, ClosureDate: Date, FinalDate: Date, FacultyID: number): Promise<events> {
    return prisma.events.create({
      data: {
        Name,
        Description,
        ClosureDate,
        FinalDate,
        FacultyID,
      },
    });
  }

  async getAllEvents(): Promise<events[]> {
    return prisma.events.findMany();
  }

  async getEventById(ID: number): Promise<events | null> {
    return prisma.events.findUnique({
      where: { ID },
    });
  }
}

export default new EventService();
