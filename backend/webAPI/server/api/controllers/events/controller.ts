import EventsService from '../../services/events.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import eventsService from '../../services/events.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EventsController implements ISuperController {
    async all(req: Request, res: Response): Promise<void> {
        const depth = Number.parseInt(req.query.depth?.toString() ?? '');

        const result = await EventsService.all(depth);
        res.json(result);
    }

    byId(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);        
        const depth = Number.parseInt(req.query.depth?.toString() ?? '');
        const contribution : boolean = req.query.contribution?.toString() == 'true' ? true: false ;

        try {
            EventsService.byId(id,depth,contribution).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    async create(req: Request, res: Response): Promise <void> {
        const validations = await EventsService.validateConstraints(req.body);
        if(!validations.isValid){
          res.status(400).json({error: validations.error, message : validations.message}).end();
          return;
        }
        
        try {
            EventsService.create(req.body).then((r) =>
                res.status(201).location(`/api/v1/events/${r.id}`).json(r)
            );
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    delete(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);
        try {
            EventsService.delete(id).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    async update(req: Request, res: Response): Promise <void> {
        const validations = await EventsService.validateConstraints(req.body);
        if(!validations.isValid){
          res.status(400).json({error: validations.error, message : validations.message}).end();
          return;
        }
        const id = Number.parseInt(req.params['id']);
        if (!/^\d{1,20}$/.test(id.toString())) {
          res.status(400).json({error: "Invalid Event ID", message : "Event ID must be a number with a maximum of 20 digits."}).end();
          return;
        }
        const eventExist = await prisma.events.findUnique({where : {ID : id}})
        if(!eventExist)
        {
          res.status(400).json({error: "Invalid Event ID", message : "Referenced Event does not exist."}).end();
          return;
        }
        try {
            EventsService.update(id, req.body).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }
}

export default new EventsController();
