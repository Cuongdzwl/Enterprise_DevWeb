import express from 'express';
import controller from './controller';
import { authenticateToken,authorizeRole } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/', controller.create)
  .get('/', controller.all)
  .get('/:id',authenticateToken,authorizeRole("admin"), controller.byId)
  .delete('/:id',authenticateToken,authorizeRole("admin"), controller.delete)
  .put('/:id',authenticateToken,authorizeRole("admin"), controller.update);


  
