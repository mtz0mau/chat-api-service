import express from "express";
import { validateToken } from "../middleware/auth.js";
import { createPrivateChat, getChats, validateCreatePrivate } from "../controllers/chatController.js";

const router = express.Router();

router.get("/private", validateToken, getChats);
router.post("/private", validateToken, validateCreatePrivate, createPrivateChat);

export default router;
