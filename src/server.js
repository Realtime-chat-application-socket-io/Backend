import express from 'express';
import {ENV} from "./lib/env.js"


import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser";
import cors from "cors";


const app=express();


const PORT=ENV.PORT || 3000;

app.use(express.json())//req.body
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))
app.use(cookieParser());
app.use(cors)

app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
    connectDB()
})