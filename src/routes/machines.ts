import express from 'express';
import * as controller from '../controllers/machines';

const router = express.Router();

router.post('/machines', controller.create);
router.get('/machines', controller.retrieveAll);
router.get('/machines/:nickname', controller.retrieveOne);

export default router;
