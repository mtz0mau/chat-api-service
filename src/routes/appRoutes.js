import express from "express";
import { createApp, getApps, updateApp, validateApp } from "../controllers/appController.js";
import { isAuth, isRoot } from "../middleware/auth.js";

const router = express.Router();

// root protected routes
router.post("/", isRoot, validateApp, createApp);

// auth protected routes
router.get("/", isAuth, getApps);
router.put("/:uuid", isAuth, validateApp, updateApp);

export default router;
