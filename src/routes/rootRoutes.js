import express from "express";
import { register, validateEmail, validateRegister } from "../controllers/rootController.js";
const router = express.Router();

// public routes
router.post("/register", validateRegister, register);
router.get("/validate-email/:token", validateEmail);

export default router;
