import { validationResult, check } from "express-validator";
import prisma from "../database/prisma.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch users" });
  }
};

export const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to create the user" });
  } 
};

export const validateUser = [
  check('name').isString().isLength({ min: 3, max: 255 }),
];
