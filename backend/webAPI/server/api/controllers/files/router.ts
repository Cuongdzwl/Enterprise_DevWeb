import express from 'express';
import controller from './controller';
import { authenticateToken,authorizeRole } from '../../middlewares/authentication.handler';

export default express
  .Router()
  .post('/upload',authenticateToken,authorizeRole("student"), controller.create)
  .get('/',authenticateToken,authorizeRole("student,coordinator"), controller.all)
  .get('/:id',authenticateToken,authorizeRole("student,coordinator,manager"), controller.byId)
  .delete('/:id',authenticateToken,authorizeRole("student"), controller.delete)
  .put('/upload/:id',authenticateToken,authorizeRole("student,coordinator"), controller.update);
  