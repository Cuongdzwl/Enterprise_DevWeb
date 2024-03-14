import ExamplesService from '../../services/users.service';
import { Request, Response } from 'express';
import {ISuper} from '../../interfaces/ISuper.interface'

export class UsersController {
async all(_: Request, res: Response): Promise<void> {
    const result = await ExamplesService.all();
    res.json(result);
}

  byId(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    ExamplesService.byId(id).then((r) => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  create(req: Request, res: Response): void {
    ExamplesService.create(req.body.name).then((r) =>
      res.status(201).location(`/api/v1/examples/${r.id}`).json(r)
    );
  }
}
export default new UsersController();
