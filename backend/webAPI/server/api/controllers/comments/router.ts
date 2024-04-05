import express from 'express';
import controller from './controller';
import { authenticateToken,authorizeRole } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/',authenticateToken,authorizeRole("student,coordinator"), controller.create)
  .get('/',authenticateToken,authorizeRole("student,coordinator"), controller.all)
  .get('/:id',authenticateToken,authorizeRole("student,coordinator"), controller.byId)
  .delete('/:id',authenticateToken,authorizeRole("student,coordinator"), controller.delete)
  .put('/:id',authenticateToken,authorizeRole("student,coordinator"), controller.update);

