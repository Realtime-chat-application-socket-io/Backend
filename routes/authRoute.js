import express from "express";
import {signup, login, logout , update} from "../controller/authController.js"
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup",signup);

router.post("/login",verifyToken,login);

router.post("/logout", logout);

router.put("/update",verifyToken, update);

export default router;