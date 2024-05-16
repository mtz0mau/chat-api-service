import { JWT_SECRET_KEY } from "../config/jwt.js";
import prisma from "../database/prisma.js";
import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  // validate Bearer token
  const token = getToken(req);

  // comprobate if token not null
  if (!token) {
    return res.status(403).json({ error: "Access denied" });
  }

  // comprobate decoded token
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    // validate if user exists
    const user = await prisma.user.findUnique({
      where: {
        uuid: decoded.uuid,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
  } catch (error) {
    return res.status(403).json({ error: "Access denied. Invalid token." });
  }

  next();
};

export const isRoot = async (req, res, next) => {
  // validate Bearer token
  const token = getToken(req);

  // comprobate if token not null
  if (!token) {
    return res.status(403).json({ error: "Access denied" });
  }

  // comprobate decoded token
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);

    // validate if user exists
    const root = await prisma.root.findUnique({
      where: {
        uuid: decoded.uuid,
      },
    });

    if (!root) return res.status(404).json({ error: "Root not found" });

    // comprobate if user valid_email is true
    if (!root.valid_email) {
      return res.status(403).json({ error: "Access denied. Email not validated." });
    }

    req.root = root;
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

const getToken = (req) => {
  // validate Bearer token
  const raw_token = req.headers.authorization;
  if (!raw_token) return;
  return raw_token.split(" ")[1];
};
