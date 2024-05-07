import { check, validationResult } from "express-validator";
import prisma from "../database/prisma.js";
import { getIo } from "../socket/socket.js";

export const createPrivateChat = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { uuid, app_uuid } = req.user;
  const { receiver_uuid } = req.body;

  // comprobate if receiver_uuid is the same as the user's uuid
  if (receiver_uuid === uuid) {
    return res.status(400).json({ error: "You can't create a chat with yourself" });
  }

  try {
    // comprobate if receiver exists
    const receiverExists = await prisma.user.findUnique({
      where: {
        uuid: receiver_uuid,
        app: { uuid: app_uuid }
      },
    });
    if (!receiverExists) return res.status(404).json({ error: "Receiver not found" });

    // comprobate if chat already exists
    const chatExists = await prisma.chat.findFirst({
      where: {
        AND: [
          {
            userChats: {
              some: {
                user: {
                  uuid: receiver_uuid,
                },
              },
            },
          },
          {
            userChats: {
              some: {
                user: {
                  uuid,
                },
              },
            },
          },
        ],
      },
    });

    if (chatExists) return res.status(400).json({ error: "Chat already exists" });

    const chat = await prisma.chat.create({
      data: {
        type: 'private',
        app: {
          connect: {
            uuid: app_uuid,
          }
        },
        userChats: {
          create: [
            {
              user: {
                connect: { uuid },
              },
              type: 'member'
            },
            {
              user: {
                connect: { uuid: receiver_uuid }
              },
              type: 'member'
            }
          ]
        }
      },
    });

    // Emit an event to the chat room
    getIo().to(chat.uuid).emit('chatCreated', chat);

    res.status(201).json(chat);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "An error occurred while trying to create the chat" });
  }
};

export const getChats = async (req, res) => {
  const { uuid } = req.user;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userChats: {
          some: {
            user: {
              uuid,
            },
          },
        },
      },
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to get the chats" });
  }
};

export const getMessages = async (req, res) => {
  const { uuid: chat_uuid } = req.params;
  const { uuid: user_uuid } = req.user;

  // compronate if chat_uuid is a valid uuid
  if (!chat_uuid) return res.status(400).json({ error: "Chat UUID is required" });

  try {
    // comprobate if chat exists
    const chat = await prisma.chat.findUnique({
      where: {
        uuid: chat_uuid,
      },
    });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    // comprobate if user is part of the chat
    const chatUser = await prisma.userChat.findFirst({
      where: {
        chat: { uuid: chat_uuid },
        user: { uuid: user_uuid },
      },
    });
    if (!chatUser) return res.status(404).json({ error: "Chat not found" });

    // get messages order by created_at
    const messages = await prisma.message.findMany({
      where: {
        chat: {
          uuid: chat_uuid,
          userChats: {
            some: {
              user: {
                uuid: user_uuid,
              },
              chat: {
                uuid: chat_uuid,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to get the messages" });
  }
};

export const validateCreatePrivate = [
  check("receiver_uuid").isString().notEmpty(),
];
