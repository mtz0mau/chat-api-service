import { Server } from "socket.io";
import { corsOptions } from "../config/server.js";

let io;

export async function configureSocket(server) {
  io = new Server(server, {
    cors: corsOptions
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('message', (message) => {
      io.to(message.chatId).emit('message', message);
    });
  });
}

export function getIo() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
