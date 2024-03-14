import express from 'express';
import eventController from '../../controllers/events/controller';

const router = express.Router();

router.post('/', eventController.create);
router.get('/', eventController.all);
router.get('/:id', eventController.byId);

export default router;
