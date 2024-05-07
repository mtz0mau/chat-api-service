import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';
console.log(JWT_SECRET_KEY)
