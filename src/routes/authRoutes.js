import express from "express";
import { register, validateRegister } from "../controllers/authController.js";
import { validateApp } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", validateApp, validateRegister, register);

export default router;
