import { Role } from './../../models/Role';
import UsersService from '../../services/users.service';
import FacultiesService from '../../services/faculties.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { UserDTO } from '../../models/DTO/User.DTO';
import L from '../../../common/logger';
export class UsersController implements ISuperController {
  async all(req: Request, res: Response): Promise<void> {
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const users = await UsersService.all(depth);
    res.status(200).json(users);
  }

  async byId(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params['id']);
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');

    try {
      await UsersService.byId(id,depth).then((r) => {
        if (r) {
          const result: UserDTO = new UserDTO().map(r);
          res.json(result);
        } else {
          res.status(404).end();
        }
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }
  create(req: Request, res: Response): void {
    if (!UsersService.validateConstraints(req.body)) {
      res.status(400).json({}).end();
    }
    try {
      UsersService.create(req.body).then((r) =>
        res.status(201).location(`/api/v1/users/${r.id}`).json(r)
      );
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  delete(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    try {
      UsersService.delete(id).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    if (!UsersService.validateConstraints(req.body)) {
      res.status(400).json({}).end();
    }
    const id = Number.parseInt(req.params['id']);
    try {
      await UsersService.update(id, req.body).then((r) => {
        // TODO: FIX THIS!! WRONG RESPONSE CODE
        if (r) res.status(201).json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }
  profile(_: Request, res: Response): void {
    res.status(201).json(res.locals.user.user.userID).end();
  }
  updateProfile(req: Request, res: Response): void {
    const id = Number.parseInt(res.locals.user.user.userID);
    try {
      UsersService.update(id, req.body).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }
}

export default new UsersController();
