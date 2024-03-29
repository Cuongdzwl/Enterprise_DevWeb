import ContributionsService from '../../services/contributions.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { PrismaClient } from '@prisma/client';

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
        const comment :boolean = req.query.comment?.toString() == "true" ? true : false;
        const file : boolean = req.query.file?.toString() == "true" ? true : false;

        try {
            ContributionsService.byId(id,depth,comment,file).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }


    async create(req: Request, res: Response): Promise <void> {
        const validations = await ContributionsService.validateConstraints(req.body);
        if(!validations.isValid){
          res.status(400).json({error: validations.error, message : validations.message}).end();
          return;
        }
        try {
            const r = await ContributionsService.create(req.body)
            const { contribution, files } = req.body;
            await ContributionsService.createFile(files, r.ID)
            res.status(201).location(`/api/v1/contributions/${r.id}`).json(r)
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
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
            await ContributionsService.createFile(files, r.ID)
            res.status(201).location(`/api/v1/contributions/${r.id}`).json(r)
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }
}

export default new ContributionsController();
