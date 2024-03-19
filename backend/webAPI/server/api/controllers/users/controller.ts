import UserService from '../../services/users.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';

export class UsersController implements ISuperController {
  async all(_: Request, res: Response): Promise<void> {
    const result = await UserService.all();
    res.json(result);
  }

  byId(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    try {
      UserService.byId(id).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  create(req: Request, res: Response): void {
    try {
      UserService.create(req.body).then((r) =>
        res.status(201).location(`/api/v1/examples/${r.id}`).json(r)
      );
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  delete(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    try {
      UserService.delete(id).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  update(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    try {
      UserService.update(id, req.body).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }
}
export default new UsersController();
