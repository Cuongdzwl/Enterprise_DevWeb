import UsersService from '../../services/users.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';

export class UsersController implements ISuperController {
  async all(req: Request, res: Response): Promise<void> {
    if(req.query.search as string){
      const users = await UsersService.search(req.query.search as string, req.query.keyword as string);
      res.status(200).json(users);
      return;
    }
    const result = await UsersService.all();
    res.json(result);
  }

  byId(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    try {
      UsersService.byId(id).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) { 
      res.status(400).json({ error: error.message }).end();
    }
  }
  create(req: Request, res: Response): void {
    if(!UsersService.validateConstraints(req.body))
    {
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

  update(req: Request, res: Response): void {
    if(!UsersService.validateConstraints(req.body))
    {
        res.status(400).json({}).end();
    }
    const id = Number.parseInt(req.params['id']);
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
