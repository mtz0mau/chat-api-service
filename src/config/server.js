import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.APP_PORT || 3000;
export const CORS_ORIGINS = process.env.CORS_ORIGINS || 'http://localhost:3000';
