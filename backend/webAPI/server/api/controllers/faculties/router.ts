import express from 'express';
import controller from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/',authenticateToken,authorizeRole("admin"), controller.create)
  .get('/',authenticateToken,authorizeRole("admin,manager"), controller.all)
  .get('/public', controller.guest)
  .get('/public/:id', controller.guestById)
  .get('/public/:id/events', controller.guestEvents)
  .get('/public/:id/events/:eventid/contributions', controller.guestEventContributions)
  .get('/:id',authenticateToken, controller.byId)
  .delete('/:id',authenticateToken,authorizeRole("admin"), controller.delete)
  .put('/:id',authenticateToken,authorizeRole("admin"), controller.update);
