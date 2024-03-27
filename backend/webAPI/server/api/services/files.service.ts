import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { File } from '../models/File';
import { EventExceptionMessage, ExceptionMessage, FileExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { BlobServiceClient } from '@azure/storage-blob';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import stream from 'stream';
import { promisify } from 'util';


const prisma = new PrismaClient();
const model = 'files';
const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=ducddsa;AccountKey=2sCmFG1XWdtvp7uj7jCnfdM5MZmi8JNIe0xm41wVaU426sC7v5mJqiIJgTuXdaUN1xzk5JV+bws6+AStqN/Tcw==;EndpointSuffix=core.windows.net";
const containerName = "ducddsa";
const pipeline = promisify(stream.pipeline);
const archiver = require('archiver');


export class FilesService implements ISuperService<File> {
  all(): Promise<any> {
    const files = prisma.files.findMany();
    L.info(files, `fetch all ${model}(s)`);
    return Promise.resolve(files);
  }
  // Filter
  async byId(id: number): Promise<any> {
    L.info(`fetch ${model} with id ${id}`);
    const file = await prisma.files.findUnique({
      where: { ID: id },
    })
    if (!file || !file.Url) {
      L.error(`File with ID ${id} not found or does not have a URL`);
      return Promise.reject(`File with ID ${id} not found or does not have a URL`);
    }
    const outputPath = `downloads/${file.ID}.pdf`;
    await this.downloadBlobToFile(file.Url, outputPath);
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
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `uploads/${Date.now()}-${path.basename(filePath)}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadFile(filePath);
    return blockBlobClient.url;
}
async downloadBlobToFile(url: string, outputPath: string): Promise<void> {
  try {
      const response = await axios({
          method: 'GET',
          url: url,
          responseType: 'stream',
      });
      await pipeline(response.data, fs.createWriteStream(outputPath));
      L.info(`Downloaded file from ${url} to ${outputPath}`);
  } catch (error) {
      L.error(`Error downloading file from ${url}: ${error}`);
      throw error;
  }
}

  // Create
  async create(file: File ): Promise<any> {
    // TODO: VALIDATE CONSTRAINTss
    // const validations = await this.validateConstraints(file)
    // if(!validations.isValid){
    //   L.error(`create ${model} failed: invalid constraints`);
    // return Promise.resolve({
    //   error: validations.error,
    //   message: validations.message,
    // });
    // }
    try {
      // Validate Constraint
      L.info(`create ${model} with id ${file.ID}`);
      console.log(file.Path);
      const filePath = file.Path;
      file.Url = await this.uploadFileToBlob(filePath);
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
    // const validations = await this.validateConstraints(file)
    // if(!validations.isValid){
    //   L.error(`update ${model} failed: invalid constraints`);
    // return Promise.resolve({
    //   error: validations.error,
    //   message: validations.message,
    // });
    // }
    try {
      L.info(`update ${model} with id ${file.ID}`);
      file.Url = await this.uploadFileToBlob(file.Path);
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
    const stats = fs.statSync(file.Path);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
    if (fileSizeInMegabytes > 5) {
      return { isValid: false, error: FileExceptionMessage.INVALID, message: "File size exceeds 5 MB limit." };
    }
    // Validate URL
    if (!file.Url || file.Url.length > 3000) {
        return { isValid: false, error: FileExceptionMessage.INVALID, message: "File URL is invalid or too long, with a maximum of 3000 characters." };
    }

    // Validate ContributionID
    if(file.ContributionID === null || file.ContributionID === undefined|| !file.ContributionID){
      return {
        isValid: false,
        error: FileExceptionMessage.INVALID_CONTRIBUTIONID,
        message: 'Contribution ID must be a number with a maximum of 20 digits',
      };
    }
    if (!/^\d{1,20}$/.test(file.ContributionID.toString())) {
        return { isValid: false, error: FileExceptionMessage.INVALID_CONTRIBUTIONID, message: "Invalid Contribution ID format." };
    }

    // If all validations pass
    return { isValid: true };
}

}

export default new FilesService();
