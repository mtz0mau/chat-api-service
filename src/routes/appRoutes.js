import express from "express";
import { createApp, getApps, updateApp, validateApp, getUsers } from "../controllers/appController.js";
import { isRoot } from "../middleware/auth.js";

const router = express.Router();

// root protected routes
router.post("/", isRoot, validateApp, createApp);
router.get("/", isRoot, getApps);
router.get("/:uuid/users", isRoot, getUsers);
router.put("/:uuid", isRoot, validateApp, updateApp);

export default router;
