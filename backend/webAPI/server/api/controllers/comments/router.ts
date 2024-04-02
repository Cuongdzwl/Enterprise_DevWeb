import express from 'express';
import controller from './controller';
import { authenticateToken,authorizeRole } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/',authenticateToken, controller.create)
  .get('/',authenticateToken, controller.all)
  .get('/:id',authenticateToken, controller.byId)
  .delete('/:id',authenticateToken, controller.delete)
  .put('/:id',authenticateToken, controller.update);

