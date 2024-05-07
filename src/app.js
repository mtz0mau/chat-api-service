import express from 'express';
import http from 'http';
import cors from 'cors';
import { configureSocket } from './socket/socket.js';
import { corsOptions, PORT, updateAllowedDomains } from './config/server.js';
import { appRoutes, authRoutes, chatRoutes, messageRoutes, profileRoutes, userRoutes } from './routes/routes.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chats', chatRoutes);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

(async () => {
  await updateAllowedDomains();

  app.use(cors(corsOptions));

  console.log('Configurando socket...')
  await configureSocket(server);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
