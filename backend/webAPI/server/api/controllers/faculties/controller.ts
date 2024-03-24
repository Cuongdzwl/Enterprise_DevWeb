import FacultyService from '../../services/faculties.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FacultiesController implements ISuperController {
  async all(req: Request, res: Response): Promise<void> {
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const result = await FacultyService.all(depth);
    res.json(result);
  }

  byId(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    try {
      FacultyService.byId(id,depth).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const validations = await FacultyService.validateConstraints(req.body);
    if(!validations.isValid){
      res.status(400).json({error: validations.error, message : validations.message}).end();
      return;
    }
    try {
      FacultyService.create(req.body).then((r) => {
        res.status(201).location(`/api/v1/faculties/${r.id}`).json(r);
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  delete(req: Request, res: Response): void {
    const id = Number.parseInt(req.params['id']);
    try {
      FacultyService.delete(id).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  async update(req: Request, res: Response): Promise <void> {
    const validations = await FacultyService.validateConstraints(req.body);
    if(!validations.isValid){
      res.status(400).json({error: validations.error, message : validations.message}).end();
      return;
    }
    const id = Number.parseInt(req.params['id']);
    if (!/^\d{1,20}$/.test(id.toString())) {
      res.status(400).json({error: "Invalid Faculty ID", message : "Faculty ID must be a number with a maximum of 20 digits."}).end();
      return;
    }
    const facultyExist = await prisma.faculties.findUnique({where : {ID : id}})
    if(!facultyExist)
    {
      res.status(400).json({error: "Invalid Faculty ID", message : "Referenced Faculty does not exist."}).end();
      return;
    }
    try {
      FacultyService.update(id, req.body).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }
}

export default new FacultiesController();
