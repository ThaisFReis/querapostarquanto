import express from 'express';
import * as betController from '../controllers/betController';

const router = express.Router();

router.post('/', betController.createBet);

export default router;