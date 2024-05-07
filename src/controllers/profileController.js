import { validationResult, check } from "express-validator";
import prisma from "../database/prisma.js";

export const getApp = async (req, res) => {
  const { app_uuid: uuid } = req.user;

  try {
    const app = await prisma.app.findUnique({
      where: {
        uuid,
      },
    });
    if (!app) {
      return res.status(404).json({ error: "App not found" });
    }
    res.status(200).json(app);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while trying to fetch the app" });
  }
};
