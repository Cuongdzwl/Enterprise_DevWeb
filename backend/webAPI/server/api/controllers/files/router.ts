import express from 'express';
import controller from './controller';
import { authenticateToken,authorizeRole } from '../../middlewares/authentication.handler';
import { upload } from '../../middlewares/uploadfile'

export default express
  .Router()
  .post('/upload',authenticateToken,upload.single('file'),  controller.create)
  .get('/',authenticateToken, controller.all)
  .get('/:id',authenticateToken, controller.byId)
  .get('/:id/download',authenticateToken, controller.download)
  .delete('/:id',authenticateToken, controller.delete)
  .put('/upload/:id',authenticateToken, controller.update);
  