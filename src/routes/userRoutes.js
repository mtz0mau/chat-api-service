import express from "express";
import { createUser, searchUsers, validateCreate, validateSearch } from "../controllers/userController.js";
import { isRoot } from "../middleware/auth.js";

const router = express.Router();

// root protected routes
router.post("/", isRoot, validateCreate, createUser);
router.get("/search", validateSearch, searchUsers);

export default router;
