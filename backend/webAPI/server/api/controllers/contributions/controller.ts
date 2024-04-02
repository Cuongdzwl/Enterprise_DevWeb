import ContributionsService from '../../services/contributions.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { PrismaClient } from '@prisma/client';
import L from '../../../common/logger';
import FilesService from '../../services/files.service';
import contributionsService from '../../services/contributions.service';
import { Contribution } from '../../models/Contribution';

const prisma = new PrismaClient();
export class ContributionsController implements ISuperController {
  async all(req: Request, res: Response): Promise<void> {
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');

    const result = await ContributionsService.all(depth);
    res.json(result);
  }

  byId(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const comment: boolean =
      req.query.comment?.toString() == 'true' ? true : false;
    const file: boolean = req.query.file?.toString() == 'true' ? true : false;

    try {
      ContributionsService.byId(id, depth, comment, file).then((r) => {
        if (r) res.status(200).json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        Name,
        Content,
        IsPublic,
        IsApproved,
        EventID,
        UserID,
        StatusID,
        LastEditByID,
        CreatedAt,
        UpdatedAt,
      } = req.body;
      console.log({ IsPublic, IsApproved });
      let isPublic = true;
      let isApproved = true;
      if (IsPublic === 'false') {
        isPublic = false;
      }
      if (IsApproved === 'false') {
        isApproved = false;
      }
      const contributionData = {
        Name,
        Content,
        IsPublic: isPublic,
        IsApproved: isApproved,
        EventID: parseInt(EventID),
        UserID: parseInt(UserID),
        StatusID: parseInt(StatusID),
        LastEditByID,
        CreatedAt,
        UpdatedAt,
      };

      contributionsService
        .create(contributionData)
        .then((createdContribution) => {
          const filesObject = req.files as {
            [fieldname: string]: Express.Multer.File[];
          };
          for (const fieldName in filesObject) {
            if (Object.prototype.hasOwnProperty.call(filesObject, fieldName)) {
              const files = filesObject[fieldName];
              for (const file of files) {
                L.info(`Processing file: ${file.originalname}`);
                if (file && createdContribution.ID) {
                  FilesService.createfile(file, createdContribution.ID);
                }
              }
            }
          }
          res
            .status(201)
            .json({ message: 'Contribution and files created successfully' });
        })
        .catch((_) => {
          res.status(400).json({ message: 'Created Failed' });
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  delete(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    try {
      ContributionsService.delete(id).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const {
      Name,
      Content,
      IsPublic,
      IsApproved,
      EventID,
      UserID,
      StatusID,
      LastEditByID,
      CreatedAt,
      UpdatedAt,
    } = req.body;
    console.log({ IsPublic, IsApproved });
    let isPublic = true;
    let isApproved = true;
    if (IsPublic === 'false') {
      isPublic = false;
    }
    if (IsApproved === 'false') {
      isApproved = false;
    }
    const contributionData = {
      Name,
      Content,
      IsPublic: isPublic,
      IsApproved: isApproved,
      EventID: parseInt(EventID),
      UserID: parseInt(UserID),
      StatusID: parseInt(StatusID),
      LastEditByID,
      CreatedAt,
      UpdatedAt,
    };
    const validations = await ContributionsService.validateConstraints(
      contributionData
    );
    if (!validations.isValid) {
      res
        .status(400)
        .json({ error: validations.error, message: validations.message })
        .end();
      return;
    }
    const id = Number.parseInt(req.params['id']);
    if (!/^\d{1,20}$/.test(id.toString())) {
      res
        .status(400)
        .json({
          error: 'Invalid Contribution ID',
          message:
            'Contribution ID must be a number with a maximum of 20 digits.',
        })
        .end();
      return;
    }
    const contributionExist = await prisma.contributions.findUnique({
      where: { ID: id },
    });
    if (!contributionExist) {
      res
        .status(400)
        .json({
          error: 'Invalid Contribution ID',
          message: 'Referenced Contribution does not exist.',
        })
        .end();
      return;
    }
    try {
      const filesObject = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      for (const fieldName in filesObject) {
        if (Object.prototype.hasOwnProperty.call(filesObject, fieldName)) {
          const files = filesObject[fieldName];
          for (const file of files) {
            L.info(`Processing file: ${file.originalname}`);
            if (file && id) {
              FilesService.createfile(file, id);
            }
          }
        }
      }
      res
        .status(201)
        .json({ message: 'Contribution and files created successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }
  async download(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params['id']);
    try {
      const files = await prisma.files.findMany({
        where: { ContributionID: id },
      });

      if (files && files.length > 0) {
        ContributionsService.downloadFilesAndZip(files)
          .then((zipContent) => {
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader(
              'Content-Disposition',
              `attachment; filename="download.zip"`
            );
            res.send(zipContent);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error creating zip file.');
          });
      } else {
        res.status(404).send('No files found for this contribution.');
      }
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }
}

export default new ContributionsController();
