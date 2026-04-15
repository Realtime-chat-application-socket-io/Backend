import express from "express";
import { signup, login, logout, updateProfile, checkAuth } from "../controller/authController.js"
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", verifyToken, updateProfile);
router.get("/check", verifyToken, checkAuth);

export default router;