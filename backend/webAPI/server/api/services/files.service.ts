import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { File } from '../models/File';
import { ExceptionMessage, FileExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';
import * as path from 'path';
import { BlobServiceClient } from '@azure/storage-blob';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const model = 'files';
const AZURE_STORAGE_CONNECTION_STRING = "AZURE_STORAGE";
const containerName = "CONTAINER_NAME";

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

  filter(filter: string, key: string): Promise<any> {
    const files = prisma.files.findMany({
      where: {
        [filter]: key,
      },
    });
    L.info(files, `fetch all ${model}(s)`);
    return Promise.resolve(files);
  }

  async uploadFileToBlob(filePath: string): Promise<string> {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING || '');
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME || '');
    const blobName = `uploads/${Date.now()}-${path.basename(filePath)}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadFile(filePath);
    return blockBlobClient.url;
}
  // Create
  async create(file: File): Promise<any> {
    // TODO: VALIDATE CONSTRAINTss
    console.log(file.Path);
    const filePath = file.Path;
    try {
      file.Url = await this.uploadFileToBlob(filePath);
    } catch (error) {
      return Promise.resolve({
        error: "Invalid File Path",
        message: "Directory of File Path is not exist",
      });
    }
    const validations = await this.validateConstraints(file)
    if(!validations.isValid){
      L.error(`create ${model} failed: invalid constraints`);
    return Promise.resolve({
      error: validations.error,
      message: validations.message,
    });
    }
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
  async update(id: number, file: File): Promise<any> {
    // Validate
    console.log(file.Path);
    const filePath = file.Path;
    try {
      file.Url = await this.uploadFileToBlob(filePath);
    } catch (error) {
      return Promise.resolve({
        error: "Invalid File Path",
        message: "Directory of File Path is not exist",
      });
    }
    const validations = await this.validateConstraints(file)
    if(!validations.isValid){
      L.error(`update ${model} failed: invalid constraints`);
    return Promise.resolve({
      error: validations.error,
      message: validations.message,
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
    async validateConstraints(file: File): Promise<{isValid: boolean, error?: string, message?: string}> {
    // Validate URL
    if (!file.Url || file.Url.length > 3000) {
        return { isValid: false, error: FileExceptionMessage.INVALID, message: "File URL is invalid or too long, with a maximum of 3000 characters." };
    }

    // Validate ContributionID
    if (!/^\d{1,20}$/.test(file.ContributionID.toString())) {
        return { isValid: false, error: FileExceptionMessage.INVALID_CONTRIBUTIONID, message: "Invalid Contribution ID format." };
    }

    const contributionsExists = await prisma.contributions.findUnique({ where: { ID: file.ContributionID } });
      if (!contributionsExists) {
          return { isValid: false, error: FileExceptionMessage.INVALID_CONTRIBUTIONID, message: "Invalid Contribution ID format." };
      }

    // If all validations pass
    return { isValid: true };
}

}

export default new FilesService();
