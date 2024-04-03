import express from 'express';
import controller from './controller';
import { authenticateToken,authorizeRole } from '../../middlewares/authentication.handler';
import { upload } from '../../middlewares/uploadfile'

export default express
  .Router()
  .post('/upload',upload.single('file'),  controller.create)
  .get('/', controller.all)
  .get('/:id', controller.byId)
  .get('/:id/download', controller.download)
  .delete('/:id', controller.delete)
  .put('/upload/:id', controller.update);
  