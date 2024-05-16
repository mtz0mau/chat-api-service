import { check, validationResult } from "express-validator";
import prisma from "../database/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from "../config/jwt.js";

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { firstname, lastname, email, password } = req.body;

  try {
    // comprobate if email is already in use
    const userExists = await prisma.root.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (userExists) return res.status(400).json({ error: 'Email is already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.root.create({
      data: {
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ uuid: user.uuid }, JWT_SECRET_KEY, { expiresIn: '24h' });

    // send email with token for validation email
    await sendToken(user);

    res.json({
      token,
      user: {
        uuid: user.uuid,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        valid_email: user.valid_email,
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "An error occurred while trying to register the user" });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // comprobate if email exists
    const user = await prisma.root.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) return res.status(400).json({ error: 'User not found' });

    // comprobate if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ uuid: user.uuid }, JWT_SECRET_KEY, { expiresIn: '24h' });

    res.json({
      token,
      user: {
        uuid: user.uuid,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        valid_email: user.valid_email,
      }
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to login the user" });
  }
};

export const validateEmail = async (req, res) => {
  // get token from url
  const { token } = req.params;

  // if token is not valid return error
  if (!token) return res.status(400).json({ error: 'Invalid token' });

  try {
    // find user with token
    const user = await prisma.root.findFirst({
      where: {
        email_token: token,
      },
    });

    // if user not found return error
    if (!user) return res.status(400).json({ error: 'Invalid token' });

    // update user with valid email
    await prisma.root.update({
      where: {
        uuid: user.uuid,
      },
      data: {
        valid_email: true,
        email_token: null,
      },
    });

    res.json({ message: 'Email validated' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while trying to validate the email' });
  }
};

const sendToken = async (root) => {
  // send email with token for validation email

  // generate token 20 characters
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // save token in database
  await prisma.root.update({
    where: {
      uuid: root.uuid,
    },
    data: {
      email_token: token,
    },
  });

  // send email
  console.log(token);
}

export const validateRegister = [
  check('firstname').isString().isLength({ min: 3, max: 255 }),
  check('lastname').isString().isLength({ min: 3, max: 255 }),
  check('email').isEmail().isLength({ min: 3, max: 255 }),
  check('password').isString().isLength({ min: 6, max: 255 }),
];

export const validateLogin = [
  check('email').isEmail().isLength({ min: 3, max: 255 }),
  check('password').isString().isLength({ min: 6, max: 255 }),
];
