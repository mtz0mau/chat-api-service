import express from "express";
import { getUser, login, register, validateLogin, validateRegister } from "../controllers/authController.js";
import { validateApp, validateToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", validateApp, validateRegister, register);
router.post("/login", validateApp, validateLogin, login);
router.get("/user", validateToken, getUser);

export default router;
