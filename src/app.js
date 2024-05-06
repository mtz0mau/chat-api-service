import express from 'express';
import cors from 'cors';
import { CORS_ORIGINS, PORT } from './config/server.js';
import { appRoutes, userRoutes } from './routes/routes.js';

const app = express();
const corsOptions = {
  origin: CORS_ORIGINS.split(','),
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/apps', appRoutes);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
