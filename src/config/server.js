import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.APP_PORT || 3000;
