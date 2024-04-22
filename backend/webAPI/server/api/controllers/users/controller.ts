import { Role } from './../../models/Role';
import { PrismaClient } from '@prisma/client';
import UsersService from '../../services/users.service';
import FacultiesService from '../../services/faculties.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { UserDTO } from '../../models/DTO/User.DTO';
import L from '../../../common/logger';
const prisma = new PrismaClient();
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
      await UsersService.byId(id, depth).then((r) => {
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
  async create(req: Request, res: Response): Promise<void> {
    const validations = await UsersService.validateConstraints(req.body, false);
    if (!validations.isValid) {
      res
        .status(400)
        .json({ error: validations.error, message: validations.message })
        .end();
      return;
    }

    UsersService.create(req.body)
      .then((r) => {
        if (r) res.status(201).location(`/api/v1/users/${r.id}`).json(r);
        else res.status(400).end();
      })
      .catch((error) => {
        res.status(400).json({ error: error.message }).end();
      });
  }

  delete(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    const userid = res.locals.user.user.ID;
    if(userid === id){
      res.status(400).json({ message: 'You cannot delete yourself' }).end();
      return;
    }
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
    // const validations = await UsersService.validateConstraints(req.body, true);
    // if (!validations.isValid) {
    //   res
    //     .status(400)
    //     .json({ error: validations.error, message: validations.message })
    //     .end();
    //   return;
    // }
    const id = Number.parseInt(req.params['id']);
    if (!/^\d{1,20}$/.test(id.toString())) {
      res
        .status(400)
        .json({
          error: 'Invalid User ID',
          message: 'User ID must be a number with a maximum of 20 digits.',
        })
        .end();
      return;
    }
    const userExist = await prisma.users.findUnique({ where: { ID: id } });
    if (!userExist) {
      res
        .status(400)
        .json({
          error: 'Invalid User ID',
          message: 'Referenced User does not exist.',
        })
        .end();
      return;
    }
    try {
      await UsersService.update(id, req.body, false).then((r) => {
        L.info(r);
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
  async updateProfile(req: Request, res: Response): Promise <void> {
    const id = Number.parseInt(res.locals.user.user.userID);
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
}

export default new UsersController();
