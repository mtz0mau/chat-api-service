import express from "express";
import { isAuth } from "../middleware/auth.js";
import { createPrivateChat, getChats, getMessages, validateCreatePrivate } from "../controllers/chatController.js";

const router = express.Router();

// auth protected routes
router.get("/private", isAuth, getChats);
router.get("/:uuid/messages", isAuth, getMessages);
router.post("/private", isAuth, validateCreatePrivate, createPrivateChat);

export default router;
