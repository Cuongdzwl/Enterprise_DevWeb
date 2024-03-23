import express from 'express';
import controller from './controller';
import { authenticateToken,authorizeRole } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .post('/', controller.create)
  .get('/', controller.all)
  .get('/:id', controller.byId)
  .delete('/:id', controller.delete)
  .put('/:id', controller.update);


  
