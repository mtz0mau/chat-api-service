import prisma from "../database/prisma.js";
import { check, validationResult } from 'express-validator';
import slugify from 'slugify';

export const getApps = async (req, res) => {
  const { root } = req;

  try {
    const apps = await prisma.app.findMany({
      where: {
        root: {
          uuid: root.uuid,
        },
      },
    });
    res.status(200).json(apps);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch apps" });
  }
};

export const createApp = async (req, res) => {
  // validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { name, urls } = req.body;
  const { root } = req;

  try {
    // generate slug from name
    const slug = slugify(name, { lower: true });

    // check if the app already exists
    const appExists = await prisma.app.findFirst({
      where: {
        root: {
          uuid: root.uuid,
        },
        slug,
      },
    });
    if (appExists) return res.status(400).json({ error: "App already exists" });

    const app = await prisma.app.create({
      data: {
        name,
        urls,
        root: { connect: { uuid: root.uuid } },
        slug,
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

export const getUsers = async (req, res) => {
  const { uuid } = req.params;
  const { root } = req;

  try {
    const app = await prisma.app.findUnique({
      where: {
        uuid,
        root: {
          uuid: root.uuid,
        },
      },
      include: {
        users: true,
      },
    });
    if (!app) {
      return res.status(404).json({ error: "App not found" });
    }
    res.status(200).json(app.users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch users" });
  }
};

export const validateApp = [
  check('name').isString().isLength({ min: 3 }),
  check('urls').isString().isLength({ min: 3 }),
];
