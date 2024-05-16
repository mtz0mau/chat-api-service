import { validationResult, check } from "express-validator";
import bcrypt from 'bcrypt';
import prisma from "../database/prisma.js";

export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { name, password, app_uuid, email, picture_url, phone_number } = req.body;
  const { root } = req;

  try {
    // comprobate if the app exists
    const appExists = await prisma.app.findFirst({
      where: {
        uuid: app_uuid,
        root: {
          uuid: root.uuid,
        },
      },
    });
    if (!appExists) return res.status(400).json({ error: "App does not exist" });

    // comprobate if the user already exists
    const userExists = await prisma.user.findFirst({
      where: {
        name,
        app: {
          uuid: app_uuid,
        },
      },
    });
    if (userExists) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        name,
        app: { connect: { uuid: app_uuid } },
        email,
        picture_url,
        phone_number,
      },
    });
    res.status(201).json({
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      picture_url: user.picture_url,
      phone_number: user.phone_number,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to create the user" });
  }
};

export const searchUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { name, app_uuid } = req.query;

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
        app: {
          uuid: app_uuid,
        }
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch users" });
  }
};

export const validateCreate = [
  check("name").isString().withMessage("Name is required"),
  check("password").isString().isLength({ min: 6 }).withMessage("Password is required and must be at least 6 characters long"),
  check("app_uuid").isString().withMessage("App UUID is required"),
];

export const validateSearch = [
  check("name").isString().isLength({ min: 3 }).withMessage("Name is required and must be at least 3 characters long"),
  check("app_uuid").isString().withMessage("App UUID is required"),
];
