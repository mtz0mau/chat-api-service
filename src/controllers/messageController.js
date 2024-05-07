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
    // comprobate if chat exists
    const chat = await prisma.chat.findUnique({
      where: {
        uuid: chat_uuid,
      },
    });
    if (!chat || chat.type !== 'private') return res.status(404).json({ error: "Chat not found" });

    // comprobate if user is part of the chat
    const chatUser = await prisma.userChat.findFirst({
      where: {
        chat: { uuid: chat_uuid },
        user: { uuid: user.uuid },
      },
    });
    if (!chatUser) return res.status(404).json({ error: "Chat not found" });

    // create message
    const message = await prisma.message.create({
      data: {
        content,
        type,
        chat: { connect: { uuid: chat_uuid } },
        user: { connect: { uuid: user.uuid } }
      },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to send the message" });
  }
};

export const validateSendPrivate = [
  check('content').isString().notEmpty().withMessage('Content is required'),
  check('type').isString().notEmpty().withMessage('Type is required'),
  check('chat_uuid').isString().notEmpty().withMessage('Chat UUID is required'),
];
