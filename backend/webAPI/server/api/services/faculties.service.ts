import { Faculty } from './../../models/Faculty';
import L from '../../common/logger';
import { PrismaClient } from '@prisma/client'
import { Filter } from 'server/models/common/Filter';

const prisma = new PrismaClient()
const model = 'faculties';

export class FacultiesService{
  all(): Promise<any> {
    const faculties = prisma.faculties.findMany()
    L.info(faculties, `fetch all ${model}(s)`);
    return Promise.resolve(faculties);
  }
  // Filter
  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const faculty = prisma.faculties.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(faculty);
  }

  filter(filter: Filter, key: string): Promise<any> {
    const faculties = prisma.faculties.findMany({
      where: {
        [filter]: key,
      },
    });
    L.info(faculties, `fetch all ${model}(s)`);
    return Promise.resolve(faculties);
  }

  // Create
  create(faculty: Faculty): Promise<any> {
    
    L.info(`create ${model}`);
    const createdUser = prisma.faculties.create({
      data: {
        Name: faculty.Name,
        Description: faculty.Description,
        IsEnabledGuest: faculty.IsEnabledGuest
      },
    });
    return Promise.resolve(createdUser);
  }
  // Delete
  delete(id: number): Promise<any> {
    L.info(`delete ${model} with id ${id}`);
    const deletedUser = prisma.faculties.delete({
      where: { ID: id },
    });
    return Promise.resolve(deletedUser);
  }
  // Update
  update(faculty: Faculty): Promise<any> {
    L.info(`update ${model} with id ${faculty.ID}`);
    const updatedFaculty = prisma.faculties.update({
      where: { ID: faculty.ID },
      data: {
        Name: faculty.Name,
        Description: faculty.Description,
        IsEnabledGuest: faculty.IsEnabledGuest
      },
    });
    return Promise.resolve(updatedFaculty);
  }
}

export default new FacultiesService();
