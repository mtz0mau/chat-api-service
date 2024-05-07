import express from "express";
import { validateToken } from "../middleware/auth.js";
import { createPrivateChat, getChats, getMessages, validateCreatePrivate } from "../controllers/chatController.js";

const router = express.Router();

router.get("/private", validateToken, getChats);
router.get("/:uuid/messages", validateToken, getMessages);
router.post("/private", validateToken, validateCreatePrivate, createPrivateChat);

export default router;
