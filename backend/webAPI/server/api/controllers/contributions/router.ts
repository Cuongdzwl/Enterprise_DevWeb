import express from 'express';
import controller from './controller';
import { authenticateToken, authorizeRole } from '../../middlewares/authentication.handler';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
export default express

  .Router()
  .post('/',authenticateToken,authorizeRole("student"),upload.fields([{ name: 'filesPath', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), controller.create)
  .get('/',authenticateToken,authorizeRole("student"), controller.all)
  .get('/:id',authenticateToken,authorizeRole("student"), controller.byId)
  .delete('/:id',authenticateToken,authorizeRole("student"), controller.delete)
  .put('/:id',authenticateToken,authorizeRole("student,coordinator"),upload.fields([{ name: 'filesPath', maxCount: 1 }, { name: 'file2', maxCount: 1 }]), controller.update)
  .get('/:id/download',authenticateToken,authorizeRole("student,manager"), controller.download);

