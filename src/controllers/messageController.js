import prisma from "../database/prisma.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch messages" });
  }
};
