import express from "express";
import { login, register, validateEmail, validateLogin, validateRegister } from "../controllers/rootController.js";
const router = express.Router();

// public routes
router.post("/register", validateRegister, register);
router.get("/validate-email/:token", validateEmail);
router.post("/login", validateLogin, login);

export default router;
