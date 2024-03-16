import { Event } from 'server/models/Event';
import { PrismaClient } from '@prisma/client';
import { events } from '@prisma/client';

const prisma = new PrismaClient();
const model = 'event';
export class EventsService {

  async create(Name: string, Description: string, ClosureDate: Date, FinalDate: Date, FacultyID: number): Promise<events> {
    return prisma.events.create({
      data: {
        Name: Name,
        Description : Description,
        ClosureDate : ClosureDate,
        FinalDate : FinalDate,
        FacultyID : FacultyID,
      },
    });
  }

  async all(): Promise<events[]> {
    return prisma.events.findMany();
  }

  async byId(ID: number): Promise<events | null> {
    return prisma.events.findUnique({
      where: { ID },
    });
  }
  async update(ID: number ,Name: string, Description: string, ClosureDate: Date, FinalDate: Date, FacultyID: number): Promise<events> {
    return prisma.events.update({
      where: { ID: ID },
      data: {
        Name: Name,
        Description : Description,
        ClosureDate : ClosureDate,
        FinalDate : FinalDate,
        FacultyID : FacultyID,
      },
    });
  }

  async delete(ID : number) {
    return prisma.events.delete({
      where: { ID: ID },
    });
  }
}

export default new EventsService();