import express from "express";
import { isAuth } from "../middleware/auth.js";
import { getApp } from "../controllers/profileController.js";

const router = express.Router();

// auth protected routes
router.get("/app", isAuth, getApp);

export default router;
