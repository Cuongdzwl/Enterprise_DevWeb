import { error } from 'console';
import EventsService from '../../services/events.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import eventsService from '../../services/events.service';
import { PrismaClient } from '@prisma/client';
import facultiesService from '../../services/faculties.service';
import L from '../../../common/logger';

const prisma = new PrismaClient();

export class EventsController implements ISuperController {
  async all(req: Request, res: Response): Promise<void> {
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    if (
      res.locals.user.user.RoleID === 4 ||
      res.locals.user.user.RoleID === 3
    ) {
      const result = await eventsService.filter(
        'FacultyID',
        res.locals.user.user.FacultyID as string
      );
      res.status(200).json(result);
      return;
    }
    const result = await EventsService.all(depth);
    res.status(200).json(result);
  }

  byId(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const isPublic = Boolean(req.query.isPublic);
    const contribution: boolean =
      req.query.contribution?.toString() == 'true' ? true : false;
    const user = res.locals.user.user;

    if (user.RoleID === 4) {
      EventsService.byId(id, depth, contribution, isPublic, user.ID)
        .then((r) => {
          L.info(r);
          if (r) res.json(r);
          else res.status(404).end();
        })
        .catch((error) => {
          res.status(400).json({ error: error }).end();
        });
      return;
    } else {
      EventsService.byId(id, depth, contribution, isPublic)
        .then((r) => {
          if (r) res.json(r);
          else res.status(404).end();
        })
        .catch((error) => {
          res.status(400).json({ error: error }).end();
        });
      return;
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const validations = await EventsService.validateConstraints(req.body);
    if (!validations.isValid) {
      res
        .status(400)
        .json({ error: validations.error, message: validations.message })
        .end();
      return;
    }
    EventsService.create(req.body)
      .then((r) => res.status(201).location(`/api/v1/events/${r.id}`).json(r))
      .catch((e) => res.status(400).json({ error: e }));
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

  async update(req: Request, res: Response): Promise<void> {
    const validations = await EventsService.validateConstraints(req.body);
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
          error: 'Invalid Event ID',
          message: 'Event ID must be a number with a maximum of 20 digits.',
        })
        .end();
      return;
    }
    const eventExist = await prisma.events.findUnique({ where: { ID: id } });
    if (!eventExist) {
      res
        .status(400)
        .json({
          error: 'Invalid Event ID',
          message: 'Referenced Event does not exist.',
        })
        .end();
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
