import express from 'express';
import controller from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/',authenticateToken,authorizeRole("student"), controller.create)
  .get('/',authenticateToken,authorizeRole("student"), controller.all)
  .get('/:id',authenticateToken,authorizeRole("admin"), controller.byId)
  .delete('/:id',authenticateToken,authorizeRole("student"), controller.delete)
  .put('/:id',authenticateToken,authorizeRole("student,coordinator"), controller.update);

