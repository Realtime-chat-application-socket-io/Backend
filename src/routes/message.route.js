import express from "express";
import { getAllContacts } from "../controllers/message.contoller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router=express.Router();

router.get("/contacts",protectRoute,getAllContacts);
// router.get("/chats",getChatPartners);
// router.get("/:id",getMessagesByUserId);
// router.post("/send/:id",sendMessage)

// router.get("/receive",(req,res)=>{
//     res.send("Receive message endpoint");
// })

export default router;