import express from "express";
import { createApp, getApps, validateApp } from "../controllers/appController.js";
import { validateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", validateToken, getApps);
router.post("/", validateToken, validateApp, createApp);

export default router;
