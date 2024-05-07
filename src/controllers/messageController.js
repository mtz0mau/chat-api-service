import prisma from "../database/prisma.js";
import { check, validationResult } from "express-validator";

export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch messages" });
  }
};

export const sendPrivateMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { user } = req;
  const { content, type, chat_uuid } = req.body;

  try {
    // response
    res.status(201).json({ message: "Message sent successfully", chat });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to send the message" });
  }
};

export const validateSendPrivate = [
  check('content').isString().notEmpty().withMessage('Content is required'),
  check('type').isString().notEmpty().withMessage('Type is required'),
  check('receiver_uuid').isString().notEmpty().withMessage('Receiver UUID is required'),
];
