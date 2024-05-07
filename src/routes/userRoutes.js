import express from "express";
import { getUsers } from "../controllers/userController.js";
import { isRoot } from "../middleware/auth.js";

const router = express.Router();

// root protected routes
router.get("/", isRoot, getUsers);

router.post("/", (req, res) => {
  res.send("User route post");
});

export default router;
