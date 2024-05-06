import express from 'express';
import cors from 'cors';
import { CORS_ORIGINS, PORT } from './config/server.js';
import { appRoutes, authRoutes, messageRoutes, userRoutes } from './routes/routes.js';

const app = express();
const corsOptions = {
  origin: CORS_ORIGINS.split(','),
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/messages', messageRoutes);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
