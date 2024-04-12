import L from '../../common/logger';
import { PrismaClient } from '@prisma/client';
import { File } from '../models/File';
import { ExceptionMessage, FileExceptionMessage } from '../common/exception';
import { ISuperService } from '../interfaces/ISuperService.interface';
import { FileDTO } from '../models/DTO/File.DTO';
import { BlobServiceClient } from '@azure/storage-blob';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import stream from 'stream';
import { promisify } from 'util';


const prisma = new PrismaClient();
const model = 'files';
const JSZip = require('jszip');
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
    const zip = new JSZip();
    // L.info(`fetch ${model} with id ${id}`);
    const file = await prisma.files.findUnique({
      where: { ID: id },
    })
    if (!file || !file.Url) {
      L.error(`File with ID ${id} not found or does not have a URL`);
      return Promise.reject(`File with ID ${id} not found or does not have a URL`);
    }
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
  private async uploadFileToBlob(file: Express.Multer.File): Promise<string> {
    try{
      L.info("Uploading file....")
      const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING|| '');
      const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME|| '');
      const blobName = `${Date.now()}-${file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.uploadData(fs.readFileSync(file.path), {
        blobHTTPHeaders: { blobContentType: file.mimetype }
      });
      L.info("Uploaded:" + file.filename);
      // fs.unlinkSync(file.path);
      return Promise.resolve(blockBlobClient.url);

    }catch(error){
      L.error(error)
      return Promise.reject("");
    }

  }
async downloadBlobToFile(file: FileDTO) {
  const zip = new JSZip();
  try {
    if(!file.Url)
    {
      return null
    }
    const response = await axios.get(file.Url, { responseType: 'arraybuffer' });
    const fileName = path.basename(new URL(file.Url).pathname);
    L.info({ fileName });
    L.info({ response });
    const fileData = Buffer.from(response.data);
    zip.file(fileName, fileData);
  } catch (error) {
    console.error(`Failed to download file: ${file.Url}`, error);
    // Nếu việc tải xuống thất bại, bạn có thể quyết định làm gì tùy theo nhu cầu của bạn,
    // ví dụ trả về null, throw một exception mới, hoặc handle lỗi theo cách khác
    return null; // hoặc throw new Error('Failed to download file');
  }

  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  return zipContent;
}

  // Create
  async create(file: File ): Promise<any> {
    // TODO: VALIDATE CONSTRAINTss
    console.log(file.Path);
    const filePath = file.Path;
    try {
      // file.Url = await this.uploadFileToBlob(filePath);
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
      console.log(file.Path);
      const filePath = file.Path;
      // file.Url = await this.uploadFileToBlob(filePath);
      const createdFile = prisma.files.create({
        data: {
          Url: file.Url,
          ContributionID: file.ContributionID,
        },
      });
      return Promise.resolve(createdFile);
    } catch (error) {
      L.error(`create ${model} failed: ${error}`);
      return Promise.reject({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }
  }

  async createfile(file: Express.Multer.File, contributionID: number): Promise<any> {
    try{
      const url = await this.uploadFileToBlob(file);
      const stats = fs.statSync(file.path);
      const fileSizeInBytes = stats.size;
      const fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
      if (fileSizeInMegabytes > 5) {
        return { isValid: false, error: FileExceptionMessage.INVALID, message: "File size exceeds 5 MB limit." };
      }
      L.info(`create ${model} with id`)
      L.info(`Contribution: ${contributionID} | Url: ${url}`)
      
      const createdFile = await prisma.files.create({
        data: {
          Url: url,
          ContributionID: contributionID,
        },
      }).then((e)=>{
        L.info(`File created with ID ${e.ID}`);
        return e;
      }).catch((err)=>{
        L.error(`File creation failed: ${err}`);
      });
      return createdFile;
    }catch(error){
      L.error(`File creation failed: ${error}`);
      return Promise.reject({
        error: ExceptionMessage.INVALID,
        message: ExceptionMessage.BAD_REQUEST,
      });
    }


  }
  // Delete
  async delete(id: number): Promise<any> {
    try {
      const fileMetadata = await prisma.files.findUnique({
        where: { ID: id },
      });
  
      if (!fileMetadata) {
        throw new Error(`File with ID ${id} not found.`);
      }
      const decodedUrl = decodeURIComponent(fileMetadata.Url);
      console.log(decodedUrl);
      const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING|| '');
      const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME|| '');
  
      const blobName = decodedUrl.split('/').pop();
      if(blobName){
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.delete();
      }

      L.info(`File deleted from Azure Blob Storage: ${blobName}`);
  
      await prisma.files.delete({
        where: { ID: id },
      });
      L.info(`File metadata deleted from database: ${id}`);
  
      return { message: "File and its metadata successfully deleted" };
    } catch (err) {
      L.error(`Error during file deletion process: ${err}`);
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
      // file.Url = await this.uploadFileToBlob(filePath);
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
      // file.Url = await this.uploadFileToBlob(file.Path);
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

    const contributionsExists = await prisma.contributions.findUnique({ where: { ID: file.ContributionID } });
      if (!contributionsExists) {
          return { isValid: false, error: FileExceptionMessage.INVALID_CONTRIBUTIONID, message: "Invalid Contribution ID format." };
      }

    // If all validations pass
    return { isValid: true };
}

}

export default new FilesService();
