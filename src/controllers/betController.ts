import { Request, Response } from 'express';
import * as betService from '../services/betService';

export const createBet = async (req: Request, res: Response) => {
    const { homeTeamScore, awayTeamScore, amountBet, gameId, participantId } = req.body;
    try {
        const bet = await betService.createBet(homeTeamScore, awayTeamScore, amountBet, gameId, participantId);
        res.status(201).json(bet);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};