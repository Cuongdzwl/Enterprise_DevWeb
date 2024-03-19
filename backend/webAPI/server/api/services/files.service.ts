import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { File } from '../../models/File';
import { Filter } from '../common/filter';
import { ExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';

const prisma = new PrismaClient();
const model = 'files';

export class FilesService implements ISuperService<File> {
  all(): Promise<any> {
    const files = prisma.files.findMany();
    L.info(files, `fetch all ${model}(s)`);
    return Promise.resolve(files);
  }
  // Filter
  byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const file = prisma.files.findUnique({
      where: { ID: id },
    });
    return Promise.resolve(file);
  }

  filter(filter: Filter, key: string): Promise<any> {
    const files = prisma.files.findMany({
      where: {
        [filter]: key,
      },
    });
    L.info(files, `fetch all ${model}(s)`);
    return Promise.resolve(files);
  }

  // Create
  create(file: File): Promise<any> {
    // TODO: VALIDATE CONSTRAINTss
    if (!this.validateConstraints(file)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    //
    try {
      // Validate Constraint
      L.info(`create ${model} with id ${file.ID}`);
      const createdFile = prisma.files.create({
        data: {
          Url: file.Url,
          ContributionID: file.ContributionID,
        },
      });
      return Promise.resolve(createdFile);
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  // Delete
  delete(id: number): Promise<any> {
    try {
      L.info(`delete ${model} with id ${id}`);
      const deletedFile = prisma.files.delete({
        where: { ID: id },
      });
      return Promise.resolve(deletedFile);
    } catch (error) {
      L.error(`delete ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  // Update
  update(id: number, file: File): Promise<any> {
    // Validate
    if (!this.validateConstraints(file)) {
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
    try {
      L.info(`update ${model} with id ${file.ID}`);
      const updatedFile = prisma.files.update({
        where: { ID: id },
        data: {
          Url: file.Url,
          ContributionID: file.ContributionID,
        },
      });
      return Promise.resolve(updatedFile);
    } catch (error) {
      L.error(`update ${model} failed: ${error}`);
      return Promise.resolve({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }
  private validateConstraints(file: File): boolean {
    // TODO: VALIDATE CONSTRAINTss
    if (prisma.users.findUnique({ where: { ID: file.UserID } }) === undefined) {
      return false;
    }
    if (
      prisma.contributions.findUnique({
        where: { ID: file.ContributionID },
      }) === undefined
    ) {
      return false;
    }
    return true;
  }
}

export default new FilesService();
