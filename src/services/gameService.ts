import { PrismaClient } from '@prisma/client';
import { finalizeGameAndBets } from './betService';

const prisma = new PrismaClient();

export const createGame = async (homeTeamName: string, awayTeamName: string) => {
    const game = await prisma.game.create({
        data: {
            homeTeamName,
            awayTeamName,
            homeTeamScore: 0,
            awayTeamScore: 0,
            isFinished: false,
        },
    });
    return game;
};

export const finishGame = async (gameId: number, homeTeamScore: number, awayTeamScore: number) => {
    const game = await prisma.game.update({
        where: {
            id: gameId,
        },
        data: {
            homeTeamScore,
            awayTeamScore,
            isFinished: true,
        },
    });

    await finalizeGameAndBets(gameId, homeTeamScore, awayTeamScore);

    return game;
};

export const getAllParticipants = async () => {
    const participants = await prisma.participant.findMany();
    return participants;
};

export const getAllGames = async () => {
    const games = await prisma.game.findMany();
    return games;
};

export const getGameDetails = async (gameId: number) => {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId,
        },
        include: {
            bets: {
                select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    homeTeamScore: true,
                    awayTeamScore: true,
                    amountBet: true,
                    gameId: true,
                    participantId: true,
                    status: true,
                    amountWon: true,
                },
            },
        },
    });

    if (!game) {
        throw new Error('Game not found.');
    }

    return game;
};