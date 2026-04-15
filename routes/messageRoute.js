import express from "express";
import { getContacts, getChats, getMessages, sendMessage } from "../controller/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/contacts", verifyToken, getContacts);
router.get("/chats", verifyToken, getChats);
router.get("/:id", verifyToken, getMessages);
router.post("/send/:id", verifyToken, sendMessage);

export default router;