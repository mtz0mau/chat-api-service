import express from 'express';
import { PORT } from './config/server.js';
import prisma from "./database/prisma.js";

const app = express();

app.get('/', async (req, res) => {
  const count = await prisma.user.count();

  if (count === 0) {
    await prisma.user.create({
      data: {
        name: 'Alice',
        app: {
          create: {
            name: 'My App',
          }
        },
        role: {
          create: {
            name: 'ADMIN',
            permissions: {
              create: [
                {
                  name: 'create'
                }
              ]
            }
          }
        }
      }
    })
  }

  const users = await prisma.user.findMany();
  const roles = await prisma.role.findMany();

  res.json({
    count,
    users,
    roles
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
