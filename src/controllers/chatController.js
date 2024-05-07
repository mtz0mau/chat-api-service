import { check, validationResult } from "express-validator";
import prisma from "../database/prisma.js";

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
}

export const validateCreatePrivate = [
  check("receiver_uuid").isString().notEmpty(),
];
