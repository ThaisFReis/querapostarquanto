import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBet = async (
    homeTeamScore: number,
    awayTeamScore: number,
    amountBet: number,
    gameId: number,
    participantId: number
) => {
    const game = await prisma.game.findUnique({
        where: {
            id: gameId,
        },
    });

    if (!game || game.isFinished) {
        throw new Error('Invalid game or game already finished.');
    }

    const participant = await prisma.participant.findUnique({
        where: {
            id: participantId,
        },
    });

    if (!participant || participant.balance < amountBet) {
        throw new Error('Invalid participant or insufficient balance.');
    }

    // Subtrair o valor da aposta do saldo do participante
    await prisma.participant.update({
        where: { id: participantId },
        data: {
            balance: {
                decrement: amountBet,
            },
        },
    });

    const bet = await prisma.bet.create({
        data: {
            homeTeamScore,
            awayTeamScore,
            amountBet,
            gameId,
            participantId,
            status: 'PENDING',
            amountWon: null,
        },
    });

    return bet;
};

const calculateWinningAmount = (
    betAmount: number,
    totalWinningBetsAmount: number,
    totalBetsAmount: number
): number => {
    const houseFee = 0.3;
    const winningAmount =
        (betAmount / totalWinningBetsAmount) * totalBetsAmount * (1 - houseFee);
    return Math.floor(winningAmount);
};

const finalizeGameAndBets = async (
    gameId: number,
    homeTeamScore: number,
    awayTeamScore: number
) => {
    // Lógica para finalizar o jogo (isFinished = true e placar atualizado)

    const bets = await prisma.bet.findMany({
        where: {
            gameId,
            status: 'PENDING',
        },
    });

    const totalWinningBetsAmount = bets.reduce(
        (total, bet) => total + bet.amountBet,
        0
    );

    const totalBetsAmount = bets.reduce(
        (total, bet) => total + bet.amountBet,
        0
    );

    bets.forEach(async (bet) => {
        if (
            bet.homeTeamScore === homeTeamScore &&
            bet.awayTeamScore === awayTeamScore
        ) {
            const amountWon = calculateWinningAmount(
                bet.amountBet,
                totalWinningBetsAmount,
                totalBetsAmount
            );
            await prisma.bet.update({
                where: { id: bet.id },
                data: {
                    status: 'WON',
                    amountWon,
                },
            });
            // Atualizar o saldo do participante
            await prisma.participant.update({
                where: { id: bet.participantId },
                data: {
                    balance: {
                        increment: amountWon,
                    },
                },
            });
        } else {
            await prisma.bet.update({
                where: { id: bet.id },
                data: {
                    status: 'LOST',
                    amountWon: 0,
                },
            });
        }
    });
}

export { finalizeGameAndBets };