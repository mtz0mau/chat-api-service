import express from "express";
import { getUser, login, register, validateLogin, validateRegister } from "../controllers/authController.js";
import { validateApp, isAuth } from "../middleware/auth.js";
const router = express.Router();

// public routes
router.post("/login", validateApp, validateLogin, login);
router.post("/register", validateApp, validateRegister, register);

// auth protected routes
router.get("/user", isAuth, getUser);

export default router;
