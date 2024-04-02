import ContributionsService from '../../services/contributions.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { PrismaClient } from '@prisma/client';
import L from '../../../common/logger';
import FilesService from '../../services/files.service';
import contributionsService from '../../services/contributions.service';

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
        const { Name, Content, IsPublic, IsApproved, EventID, UserID, StatusID,LastEditByID,CreatedAt,UpdatedAt } = req.body;
        const contributionData = {
          Name,
          Content,
          IsPublic: IsPublic === 'true',
          IsApproved: IsApproved === 'true',
          EventID: parseInt(EventID),
          UserID: parseInt(UserID),
          StatusID: parseInt(StatusID),
          LastEditByID,
          CreatedAt,
          UpdatedAt
        };
        const createdContribution = await contributionsService.create(contributionData);
        // const filesArray = req.files as Express.Multer.File[];
        const file = req.file;
        console.log(req.file)
        // console.log(filesArray)
        // filesArray.map(file => 
        //   FilesService.createfile(file, createdContribution.ID))
        // if (filesArray.length === 0) {
        //     res.status(400).send("Missing files");
        //     return;
        // }
        if (!file || !createdContribution.ID) {
          res.status(400).send("Missing file or ContributionID");
          return;
        }
        await FilesService.createfile(file, createdContribution.ID);
        //   for (const file of filesArray) {
        //     console.log(file);
        //     console.log(`File name: ${file.originalname}`);
        //     console.log(`File type: ${file.mimetype}`);
        //     console.log(`File size: ${file.size}`);
        //     await FilesService.createfile(file, createdContribution.ID);
        // }
      //   if (filesArray.length === 0) {
      //     res.status(400).send("Missing files");
      //     return;
      // }
        res.status(201).json({ message: "Contribution and files created successfully" });
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

    async update(req: Request, res: Response): Promise <void> {
        const validations = await ContributionsService.validateConstraints(req.body);
        if(!validations.isValid){
          res.status(400).json({error: validations.error, message : validations.message}).end();
          return;
        }
        const id = Number.parseInt(req.params['id']);
        if (!/^\d{1,20}$/.test(id.toString())) {
          res.status(400).json({error: "Invalid Contribution ID", message : "Contribution ID must be a number with a maximum of 20 digits."}).end();
          return;
        }
        const contributionExist = await prisma.contributions.findUnique({where : {ID : id}})
        if(!contributionExist)
        {
          res.status(400).json({error: "Invalid Contribution ID", message : "Referenced Contribution does not exist."}).end();
          return;
        }
        try {
            const r = await ContributionsService.create(req.body)
            const { contribution, files } = req.body;
            await FilesService.createfile(files, r.ID)
            res.status(201).location(`/api/v1/contributions/${r.id}`).json(r)
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }
    async download(req: Request, res: Response): Promise <void> {
        const id = Number.parseInt(req.params['id']);
        try {
            const files = await prisma.files.findMany({where : {ContributionID : id}});

            if (files && files.length > 0) {
              ContributionsService.downloadFilesAndZip(files).then(zipContent => {
                res.setHeader('Content-Type', 'application/zip');
                res.setHeader('Content-Disposition', `attachment; filename="download.zip"`);
                res.send(zipContent);
              }).catch(error => {
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
