import express from "express";
import { createApp, getApps, updateApp, validateApp } from "../controllers/appController.js";
import { validateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", validateToken, getApps);
router.post("/", validateToken, validateApp, createApp);
router.put("/:uuid", validateToken, validateApp, updateApp);

export default router;
