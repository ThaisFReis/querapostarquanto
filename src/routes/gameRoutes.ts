import express from 'express';
import * as gameController from '../controllers/gameController';

const router = express.Router();

router.post('/', gameController.createGame);
router.post('/:id/finish', gameController.finishGame);
router.get('/', gameController.getAllGames);
router.get('/:id', gameController.getGameDetails);

export default router;
