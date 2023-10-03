import express from 'express';
import participantRoutes from './routes/participantRoutes';
import gameRoutes from './routes/gameRoutes';
import betRoutes from './routes/betRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/participants', participantRoutes);
app.use('/games', gameRoutes);
app.use('/bets', betRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
