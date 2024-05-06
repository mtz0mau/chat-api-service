import express from "express";
import { getMessages } from "../controllers/messageController.js";
import { validateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", validateToken, getMessages);

export default router;
