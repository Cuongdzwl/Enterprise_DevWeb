import express from 'express';
import controller from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/authentication.handler';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
export default express

  .Router()
  .post('/',upload.single('filesPath'), controller.create)
  .get('/', controller.all)
  .get('/:id', controller.byId)
  .delete('/:id', controller.delete)
  .put('/:id', controller.update)
  .get('/:id/download', controller.download);

