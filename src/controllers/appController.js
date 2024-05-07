import prisma from "../database/prisma.js";
import { check, validationResult } from 'express-validator';

export const getApps = async (req, res) => {
  try {
    const apps = await prisma.app.findMany();
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch apps" });
  }
};

export const createApp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { name, urls } = req.body;
  try {
    const app = await prisma.app.create({
      data: {
        name,
        urls
      },
    });
    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to create the app" });
  }
};

export const updateApp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { uuid } = req.params;
  const { name } = req.body;
  try {
    // comprobar si la app existe
    const appExists = await prisma.app.findUnique({
      where: {
        uuid,
      },
    });
    if (!appExists) {
      return res.status(404).json({ error: "App not found" });
    }

    const app = await prisma.app.update({
      where: {
        uuid,
      },
      data: {
        name,
      },
    });
    res.status(200).json(app);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to update the app" });
  }
};

export const validateApp = [
  check('name').isString().isLength({ min: 3 }),
  check('urls').isString().isLength({ min: 3 }),
];
