import prisma from "../database/prisma.js";

export const validateToken = (req, res, next) => {
  console.log("Validating token");
  const token = req.query.token;
  console.log(token)

  if (!token) {
    return res.status(403).json({ error: "Access denied" });
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
