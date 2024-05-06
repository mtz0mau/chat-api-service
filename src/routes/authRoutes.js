import express from "express";
import { getUser, login, register, validateLogin, validateRegister } from "../controllers/authController.js";
import { validateApp } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", validateApp, validateRegister, register);
router.post("/login", validateApp, validateLogin, login);
router.get("/user", validateApp, getUser);

export default router;
