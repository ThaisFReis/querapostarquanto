import { Request, Response } from 'express';
import * as gameService from '../services/gameService';

export const createGame = async (req: Request, res: Response) => {
    const { homeTeamName, awayTeamName } = req.body;
    try {
        const game = await gameService.createGame(homeTeamName, awayTeamName);
        res.status(201).json(game);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const finishGame = async (req: Request, res: Response) => {
    const { homeTeamScore, awayTeamScore } = req.body;
    const gameId = parseInt(req.params.id, 10);

    try {
        const game = await gameService.finishGame(gameId, homeTeamScore, awayTeamScore);
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAllGames = async (_req: Request, res: Response) => {
    try {
        const games = await gameService.getAllGames();
        res.status(200).json(games);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getGameDetails = async (req: Request, res: Response) => {
    const gameId = parseInt(req.params.id, 10);
    try {
        const game = await gameService.getGameDetails(gameId);
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};