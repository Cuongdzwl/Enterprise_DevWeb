import CommentsService from '../../services/comments.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export class CommentsController implements ISuperController {
    async all(req: Request, res: Response): Promise<void> {
        const id = Number.parseInt(req.params['id']);
        const result = await CommentsService.all();
        res.json(result);
    }

    byId(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);
        try {
            CommentsService.byId(id).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    async create(req: Request, res: Response): Promise <void> {
        const validations = await CommentsService.validateConstraints(req.body);
        if(!validations.isValid){
          res.status(400).json({error: validations.error, message : validations.message}).end();
          return;
        }
        try {
            CommentsService.create(req.body).then((r) =>
                res.status(201).location(`/api/v1/comments/${r.id}`).json(r)
            );
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    delete(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);
        try {
            CommentsService.delete(id).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    async update(req: Request, res: Response): Promise <void> {
        const validations = await CommentsService.validateConstraints(req.body);
        if(!validations.isValid){
          res.status(400).json({error: validations.error, message : validations.message}).end();
          return;
        }
        const id = Number.parseInt(req.params['id']);
        if (!/^\d{1,20}$/.test(id.toString())) {
          res.status(400).json({error: "Invalid Comment ID", message : "Comment ID must be a number with a maximum of 20 digits."}).end();
          return;
        }
        const commentExist = await prisma.comments.findUnique({where : {ID : id}})
        if(!commentExist)
        {
          res.status(400).json({error: "Invalid Comment ID", message : "Referenced Comment does not exist."}).end();
          return;
        }
        try {
            CommentsService.update(id, req.body).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }
}

export default new CommentsController();
