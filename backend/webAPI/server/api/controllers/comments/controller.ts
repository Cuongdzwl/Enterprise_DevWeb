import CommentsService from '../../services/comments.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';

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

    create(req: Request, res: Response): void {
        if(!CommentsService.validateConstraints(req.body))
        {
            res.status(400).json({}).end();
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

    update(req: Request, res: Response): void {
        if(!CommentsService.validateConstraints(req.body))
        {
            res.status(400).json({}).end();
        }
        const id = Number.parseInt(req.params['id']);
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
