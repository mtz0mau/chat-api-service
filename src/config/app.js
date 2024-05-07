import dotenv from 'dotenv';
dotenv.config();

export const APP_NAME = process.env.APP_NAME || 'chat-service';
export const NODE_ENV = process.env.NODE_ENV || 'development';
