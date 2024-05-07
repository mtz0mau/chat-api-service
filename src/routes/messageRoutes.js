import express from "express";
import { sendPrivateMessage, validateSendPrivate } from "../controllers/messageController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// auth protected routes
router.post("/private", isAuth, validateSendPrivate, sendPrivateMessage);

export default router;
