import express from "express";
import { validateToken } from "../middleware/auth.js";
import { getApp } from "../controllers/profileController.js";

const router = express.Router();

router.get("/app", validateToken, getApp);

export default router;
