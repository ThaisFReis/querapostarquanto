import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createParticipant = async (name: string, balance: number) => {
    if (balance < 1000) {
        throw new Error('Initial balance must be at least R$ 10.00');
    }
    const participant = await prisma.participant.create({
        data: {
            name,
            balance,
        },
    });
    return participant;
};

export const getAllParticipants = async () => {
    const participants = await prisma.participant.findMany();
    return participants;
};