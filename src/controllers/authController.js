import bcrypt from 'bcrypt';
import { validationResult, check } from "express-validator";
import { JWT_SECRET_KEY } from "../config/jwt.js";
import prisma from "../database/prisma.js";
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { name, email, password } = req.body;
  const app_uuid = req.headers.app_uuid;

  try {
    // comprobate if email is already in use
    const userExists = await prisma.user.findUnique({
      where: {
        email,
        app_uuid
      },
    });

    if (userExists) return res.status(400).json({ error: 'Email is already in use' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        app_uuid
      },
    });
    const token = jwt.sign({ uuid: user.uuid }, JWT_SECRET_KEY, { expiresIn: '24h' });
    res.json({
      token,
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to register the user" });
  }
};

export const getUser = (req, res) => {
  const user = req.user;
  res.json({
    uuid: user.uuid,
    name: user.name,
    email: user.email,
  });
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { email, password } = req.body;
  const app_uuid = req.headers.app_uuid;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
        app_uuid
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ uuid: user.uuid }, JWT_SECRET_KEY, { expiresIn: '24h' });
    res.json({
      token,
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while trying to login' });
  }

};

export const validateRegister = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Email is not valid'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const validateLogin = [
  check('email').isEmail().withMessage('Email is not valid'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
