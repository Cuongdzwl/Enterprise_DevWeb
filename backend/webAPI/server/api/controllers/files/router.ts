import express from 'express';
import controller from './controller';
export default express
  .Router()
  .post('/upload', controller.create)
  .get('/', controller.all)
  .get('/:id', controller.byId)
  .delete('/:id', controller.delete)
  .put('/upload/:id', controller.update);
