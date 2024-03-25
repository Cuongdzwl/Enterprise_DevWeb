import { PrismaClient } from '@prisma/client';
import RolesService from '../../services/roles.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import L from '../../../common/logger';
const prisma = new PrismaClient();
export class RolesController implements ISuperController {
    async all(_: Request, res: Response): Promise<void> {
        const result = await RolesService.all();
        res.json(result);
    }

    byId(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);
        try {
            RolesService.byId(id).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    async create(req: Request, res: Response): Promise <void> {
        const validations = await RolesService.validateConstraints(req.body);
        if(!validations.isValid){
          res.status(400).json({error: validations.error, message : validations.message}).end();
          return;
        }
        try {
            RolesService.create(req.body).then((r) =>
                res.status(201).location(`/api/v1/roles/${r.id}`).json(r)
            );
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }

    delete(req: Request, res: Response): void {
        const id = Number.parseInt(req.params['id']);
        try {
            RolesService.delete(id).then((r) => {
                if (r) res.json(r);
                else res.status(404).end();
            });
        } catch (error) {
            res.status(400).json({ error: error.message }).end();
        }
    }


  async update(req: Request, res: Response): Promise<void> {
    const validations = await RolesService.validateConstraints(req.body);
    if(!validations.isValid){
      res.status(400).json({error: validations.error, message : validations.message}).end();
      return;
    }
    const id = Number.parseInt(req.params['id']);
    if (!/^\d{1,20}$/.test(id.toString())) {
      res.status(400).json({error: "Invalid Role ID", message : "Role ID must be a number with a maximum of 20 digits."}).end();
      return;
    }
    const roleExist = await prisma.roles.findUnique({where : {ID : id}})
    if(!roleExist)
    {
      res.status(400).json({error: "Invalid Role ID", message : "Referenced Role does not exist."}).end();
      return;
    }
    try {
      await RolesService.update(id, req.body).then((r) => {
        // TODO: FIX THIS!! WRONG RESPONSE CODE
        if (r) res.status(201).json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

}

export default new RolesController();
