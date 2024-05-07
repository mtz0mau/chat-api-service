import express from "express";
import { getMessages, sendPrivateMessage, validateSendPrivate } from "../controllers/messageController.js";
import { validateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", validateToken, getMessages);
// send private message
router.post("/private", validateToken, validateSendPrivate, sendPrivateMessage);

export default router;
