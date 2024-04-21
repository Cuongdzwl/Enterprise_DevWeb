import { PrismaClient } from '@prisma/client';
import StatusService from '../../services/contributionstatus.service';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
export class ContributionStatusController {
    async all(_: Request, res: Response): Promise<void> {
        const result = await StatusService.all();
        res.json(result);
    }

    byId(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);
        try {
            StatusService.byId(id).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

}

export default new ContributionStatusController();
