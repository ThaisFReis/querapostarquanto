import express from 'express';
import * as participantController from '../controllers/participantController';

const router = express.Router();

router.post('/', participantController.createParticipant);
router.get('/', participantController.getAllParticipants);

export default router;
