import express from 'express';
import controller from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/',authenticateToken,authorizeRole("admin"), controller.create)
  .get('/', controller.all)
  .get('/public', controller.guest)
  .get('/public/:id', controller.guestById)
  .get('/public/:id/contribution/:contributionid', controller.guestEventContributions)
  .get('/:id',authenticateToken, controller.byId)
  .delete('/:id',authenticateToken,authorizeRole("admin"), controller.delete)
  .get('/:id/dashboard', controller.dashboard)
  .put('/:id',authenticateToken,authorizeRole("admin"), controller.update);

