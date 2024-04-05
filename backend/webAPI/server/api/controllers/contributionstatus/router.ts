import express from 'express';
import controller from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/authentication.handler';
export default express
  .Router()
  .get('/', controller.all)
  .get('/:id', controller.byId)

