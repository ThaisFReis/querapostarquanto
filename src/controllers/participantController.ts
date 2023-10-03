import { Request, Response } from 'express';
import * as participantService from '../services/participantService';

export const createParticipant = async (req: Request, res: Response) => {
    const { name, balance } = req.body;
    try {
        const participant = await participantService.createParticipant(name, balance);
        res.status(201).json(participant);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllParticipants = async (_req: Request, res: Response) => {
    try {
        const participants = await participantService.getAllParticipants();
        res.status(200).json(participants);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};