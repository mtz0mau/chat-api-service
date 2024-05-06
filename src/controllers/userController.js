import prisma from "../database/prisma.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch users" });
  }
};

export const createUser = (req, res) => {
  res.send("User route post");
};
