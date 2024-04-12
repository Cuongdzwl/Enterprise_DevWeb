import FacultyService from '../../services/faculties.service';
import { Request, Response } from 'express';
import { ISuperController } from '../../interfaces/ISuperController.interface';
import { PrismaClient } from '@prisma/client';
import EventsService from '../../services/events.service';
import facultiesService from '../../services/faculties.service';
import L from '../../../common/logger';

const prisma = new PrismaClient();

export class FacultiesController implements ISuperController {
  async all(req: Request, res: Response): Promise<void> {
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const result = await FacultyService.all(depth);
    res.json(result);
  }
  async guest(req: Request, res: Response): Promise<void> {
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const user = req.query.user?.toString() == 'true' ? true : false;
    const result = await FacultyService.all(depth, user,true);
    res.json(result);
  }
  async guestById(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params['id']);
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const user = req.query.user?.toString() == 'true' ? true : false;
    const event = req.query.event?.toString() == 'true' ? true : false;
    const contribution: boolean =
      req.query.contribution?.toString() == 'true' ? true : false;
    FacultyService.byId(id,2, event, user, true)
      .then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
        return;
      })
      .catch((error) => {
        res.status(400).json({ error: error }).end();
      });
  }

  async guestEventContributions(req: Request, res: Response): Promise<void> {
    const id = Number.parseInt(req.params['id']);
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const user = req.query.user?.toString() == 'true' ? true : false;
    const eventId = Number.parseInt(req.params['eventid']);
    const contributionid = Number.parseInt(req.params['contributionid']);
    const contribution: boolean =
      req.query.contribution?.toString() == 'true' ? true : false;
    FacultyService.byId(id,3,true,user,true,contributionid)
      .then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
        return;
      })
      .catch((error) => {
        res.status(400).json({ error: error }).end();
      });
  }

  async byId(req: Request, res: Response): Promise<void> {
    var id = Number.parseInt(req.params['id']);
    const depth = Number.parseInt(req.query.depth?.toString() ?? '');
    const event = req.query.event?.toString() == 'true' ? true : false;
    const user = req.query.user?.toString() == 'true' ? true : false;
    // Authorize
    if (!(res.locals.user.user.RoleID == 1 || res.locals.user.user.RoleID == 2)) {
      id = res.locals.user.user.FacultyID;
    }
    try {
      await FacultyService.byId(id, depth, event, user,false).then((r) => {
        if (r) res.json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message }).end();
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    const validations = await FacultyService.validateConstraints(req.body);
    if (!validations.isValid) {
      res
        .status(400)
        .json({ error: validations.error, message: validations.message })
        .end();
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

  async update(req: Request, res: Response): Promise<void> {
    const validations = await FacultyService.validateConstraints(req.body);
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
          error: 'Invalid Faculty ID',
          message: 'Faculty ID must be a number with a maximum of 20 digits.',
        })
        .end();
      return;
    }
    const facultyExist = await prisma.faculties.findUnique({
      where: { ID: id },
    });
    if (!facultyExist) {
      res
        .status(400)
        .json({
          error: 'Invalid Faculty ID',
          message: 'Referenced Faculty does not exist.',
        })
        .end();
      return;
    }
    try {
      FacultyService.update(id, req.body).then((r) => {
        if (r) res.status(201).json(r);
        else res.status(404).end();
      });
    } catch (error) {
      res.status(400).json(error).end();
    }
  }
  async dashboard(req: Request, res: Response): Promise<void> {
    try {
      var facultyId = Number.parseInt(req.params['id']);
      const startYear = parseInt(req.query.startYear?.toString() ?? '');
      const endYear = parseInt(req.query.endYear?.toString() ?? '');
      L.info(`${facultyId}`);
      L.info(`${startYear}`);
      if (Number.isNaN(facultyId)) {
        res.status(400).json({ error: 'Invalid facultyId provided.' }).end();
        return;
      }
      // // Validate input
      if (!Number.isInteger(facultyId) || facultyId < 1) {
        res
          .status(400)
          .json({
            error: 'Invalid facultyId: must be an integer greater than 0.',
          })
          .end();
        return;
      }
      if (!/^\d{1,20}$/.test(facultyId.toString())) {
        res
          .status(400)
          .json({
            error: 'Faculty ID must be a number with a maximum of 20 digits.',
          })
          .end();
        return;
      }
      if (!Number.isInteger(startYear) || startYear < 1 || !Number.isInteger(endYear) || endYear < 1) {
        res.status(400).json({ error: 'Invalid year range: both startYear and endYear must be integers greater than 0.' }).end();
        return;
      }
      if (startYear >= endYear) {
        res.status(400).json({ error: 'Invalid year range: startYear cannot be after endYear.' }).end();
        return;
      }
  
      // Assuming facultiesService.getDashboardDataForFacultyYear has been implemented
      const dashboardData = await facultiesService.dashboard(facultyId, startYear, endYear);
      if (!dashboardData) {
        res
          .status(404)
          .json({
            error:
              'No dashboard data found for the provided faculty ID and year.',
          })
          .end();
        return;
      }

      res.json(dashboardData);
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({ error: 'Internal Server Error' }).end();
      return;
    }
  }
  // async public() {}
}

export default new FacultiesController();
