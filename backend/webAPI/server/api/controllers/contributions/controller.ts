import ContributionsService from '../../services/contributions.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export class ContributionsController implements ISuperController {
    async all(_: Request, res: Response): Promise<void> {
        const result = await ContributionsService.all();
        res.json(result);
    }

    byId(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);
        try {
            ContributionsService.byId(id).then((r) => {
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
            ContributionsService.create(req.body).then((r) =>
                res.status(201).location(`/api/v1/contributions/${r.id}`).json(r)
            );
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
            ContributionsService.update(id, req.body).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }
}

export default new ContributionsController();
