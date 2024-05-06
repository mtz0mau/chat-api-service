import express from "express";
import { getUsers } from "../controllers/userController.js";
import { validateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", validateToken, getUsers);

router.post("/", (req, res) => {
  res.send("User route post");
});

export default router;
