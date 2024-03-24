import ContributionsService from '../../services/contributions.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';

export class ContributionsController implements ISuperController {
    async all(req: Request, res: Response): Promise<void> {
        const depth = Number.parseInt(req.query.depth?.toString() ?? '');

        const result = await ContributionsService.all(depth);
        res.json(result);
    }

    byId(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);
        const depth = Number.parseInt(req.query.depth?.toString() ?? '');

        try {
            ContributionsService.byId(id,depth).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    create(req: Request, res: Response): void {
        if(!ContributionsService.validateConstraints(req.body))
    {
        res.status(400).json({}).end();
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

    update(req: Request, res: Response): void {
     if(!ContributionsService.validateConstraints(req.body))
    {
        res.status(400).json({}).end();
    }
        const id = Number.parseInt(req.params['id']);
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
