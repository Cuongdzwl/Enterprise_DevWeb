import ContributionsService from '../../services/contributions.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { PrismaClient } from '@prisma/client';
import L from '../../../common/logger';
import FilesService from '../../services/files.service';
import contributionsService from '../../services/contributions.service';
import { Contribution } from '../../models/Contribution';
import filesService from '../../services/files.service';
import { Status } from '../../models/Status';
import { FileDTO } from '../../models/DTO/File.DTO';
import eventsService from '../../services/events.service';

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

    // Check timeline
    const isValid = contributionsService.validateClosureDate(contributionData);
    if (!isValid) {
      res.status(400).json({ error: 'The event this closed'}).end();
      return;
    }
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
    try {
      contributionsService
        .create(req.body)
        .then((createdContribution) => {
          
          const filesObject = req.files as {
            [fieldname: string]: Express.Multer.File[];
          };
          for (const fieldName in filesObject) {
            if (Object.prototype.hasOwnProperty.call(filesObject, fieldName)) {
              const files = filesObject[fieldName];
              for (const file of files){
                L.info(file.size + 'bytes');
                if(file.size > 5 * 1024 * 1024) {
                  res.status(400).json({ message: 'File too large. (5mb)' });
                  return;
                }
              }

              

              for (const file of files) {
                L.info(`Processing file: ${file.originalname}`);
                L.info(`Contribution ID: ${createdContribution.ID}`);
                if (file && createdContribution.ID) {
                  FilesService.createfile(file, createdContribution.ID).catch((error) => {L.error(error);});
                }
              }
            }
          }
          res.status(201).json({ message: 'Contribution and files created successfully' });
        })
        .catch(() => {
          res.status(400).json({ message: 'Created Failed' });
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  delete(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    try {
      // cancel notification
      // delete notification
      // delete contribution
      ContributionsService.delete(id).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    // contribution.LastEditByID = Number(res.locals.user.user.ID);
    // L.info(contributionData);
    // const validations = await ContributionsService.validateConstraints(
    //   contributionData
    // );
    // if (!validations.isValid) {
    //   res
    //     .status(400)
    //     .json({ error: validations.error, message: validations.message })
    //     .end();
    //   return;
    // }
    const id = Number.parseInt(req.params.id);
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
    const contributionFound = await prisma.contributions.findUnique({
      where: { ID: id },
    });

    if (!contributionFound) {
      res
        .status(400)
        .json({
          error: 'Invalid Contribution ID',
          message: 'Referenced Contribution does not exist.',
        })
        .end();
      return;
    }
    // var { ID, IsPublic, StatusID, Content, Name } = req.body;
    // var contribution: any = {
    //   IsPublic: IsPublic === 'true' ? true : false || Boolean(IsPublic),
    //   StatusID : Number(StatusID),
    //   Content,
    //   Name,
    // };
    var contribution = req.body;

    const isValid = contributionsService.validateFinalDate(contribution);
    if (!isValid) {
      res.status(400).json({ error: 'The event this closed'}).end();
      return;
    }
    contribution.LastEditByID = Number(res.locals.user.user.ID + '');
    try {
      if (res.locals.user.user.RoleID === 4) {
        // Student
        contribution.IsApproved = false;
        contribution.IsPublic = false;
        contribution.StatusID = Status.PENDING;
        // Block Other Student update other contribution
        if (contributionFound.UserID !== res.locals.user.user.ID) {
          res.status(403).json({ error: 'Forbidden' }).end();
          return;
        }
      } else if (res.locals.user.user.RoleID === 3) {
        // Coordinator
        //contribution.Content = contributionFound.Content as string;
        // contribution.Name = contributionFound.Name as string;
        if (contribution.StatusID == (Status.ACCEPTED as Number)) {
          contribution.IsApproved = true;
          contribution.IsPublic = req.body.IsPublic === 'true' ? true : false;
        } else {
          contribution.IsApproved = false;
          contribution.IsPublic = false;
        }
      } else {
        res.status(403).json({ error: 'Forbidden' }).end();
        return;
      }
    } catch (error) {
      L.error(error);
      res.status(400).json({ error: error.message }).end();
      return;
    }

    L.info(contribution);
    contributionsService
      .update(id, contribution as Contribution)
      .then(async () => {
        L.info(req.files);
        const filesObject = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        L.info(filesObject);
        let textFiles: Express.Multer.File[] = [];
        let imageFiles: Express.Multer.File[] = [];
        for (const fieldName in filesObject) {
          if (Object.prototype.hasOwnProperty.call(filesObject, fieldName)) {
            const files = filesObject[fieldName];
            for (const file of files) {
              file.originalname.endsWith;
              if (file.originalname) {
                if (
                  file.originalname.endsWith('.pdf') ||
                  file.originalname.endsWith('.docx')
                ) {
                  textFiles.push(file);
                } else if (
                  file.originalname.endsWith('.png') ||
                  file.originalname.endsWith('.jpeg') ||
                  file.originalname.endsWith('.JPG') ||
                  file.originalname.endsWith('jpg')
                ) {
                  imageFiles.push(file);
                }
              }
            }
          }
        }
        let ContributionFile;
        if (Object.keys(filesObject).length === 0) {
          res
            .status(201)
            .json({ message: 'Contribution and files updated successfully' });
          return;
        }
        console.log({ textFiles, imageFiles });

        if (imageFiles.length >= 1) {
          console.log('detele text');
          const texts = await prisma.files.findMany({
            where: {
              ContributionID: id,
            },
          });
          for (let i = 0; i < texts.length; i++) {
            if (
              texts[i].Url.endsWith('.pdf') ||
              texts[i].Url.endsWith('.docx')
            ) {
              await prisma.files.delete({
                where: {
                  ID: texts[i]?.ID,
                },
              });
            }
          }
        }
        if (textFiles.length >= 1) {
          console.log('detele image');
          const images = await prisma.files.findMany({
            where: {
              ContributionID: id,
            },
          });
          for (let i = 0; i < images.length; i++) {
            if (
              images[i]?.Url.endsWith('.png') ||
              images[i]?.Url.endsWith('.jpeg') ||
              images[i]?.Url.endsWith('.JPG') ||
              images[i]?.Url.endsWith('jpg')
            ) {
              await prisma.files.delete({
                where: {
                  ID: images[i]?.ID,
                },
              });
            }
          }
        }
        for (const fieldName in filesObject) {
          if (Object.prototype.hasOwnProperty.call(filesObject, fieldName)) {
            const files = filesObject[fieldName];
            for (const file of files) {
              L.info(`Processing file: ${file.originalname}`);
              if (file && id) {
                FilesService.createfile(file, id).catch((error)=>{L.error(error)});
              }
            }
          }
        }
        res
          .status(201)
          .json({ message: 'Contribution and files updated successfully' });
      })
      .catch((error) => {
        L.error(error);
        return res.status(400).json(error).end();
      });
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
