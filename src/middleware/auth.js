import { JWT_SECRET_KEY } from "../config/jwt.js";
import prisma from "../database/prisma.js";
import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  // validate Bearer token
  const raw_token = req.headers.authorization;
  if (!raw_token) return res.status(403).json({ error: "Access denied" });

  const token = raw_token.split(" ")[1];

  // comprobate if token not null
  if (!token) {
    return res.status(403).json({ error: "Access denied" });
  }

  // comprobate decoded token
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    // validate if user exists
    const user = prisma.user.findUnique({
      where: {
        uuid: decoded.uuid,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
  } catch (error) {
    return res.status(403).json({ error: "Access denied. Invalid token." });
  }

  next();
};

export const validateApp = async (req, res, next) => {
  // get app_uuid in headers
  const app_uuid = req.headers.app_uuid;

  // if app_uuid is not present
  if (!app_uuid) return res.status(403).json({ error: "Access denied" });

  // comprobate if app_uuid is valid
  const app = await prisma.app.findUnique({
    where: {
      uuid: app_uuid,
    },
  });

  if (!app) return res.status(403).json({ error: "Access denied. App invalid." });

  next();
};
