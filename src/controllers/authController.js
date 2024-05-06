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
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ id: user.uuid }, JWT_SECRET_KEY, { expiresIn: '24h' });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to register the user" });
  }
};

export const validateRegister = [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail().withMessage('Email is not valid'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];
