import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import  connectDB  from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import { initSocket } from "./socket/socket.js";
import dotenv from "dotenv"


dotenv.config()

const app = express();

app.set("trust proxy", 1); // 🔥 REQUIRED for Render/HTTPS cookies

app.use(cors({
  origin: [
    "http://localhost:5173",
     "https://pingchatify.netlify.app"
  ],
  credentials: true
}));

app.use(express.json({ limit: "15mb" })); // Increased to accommodate base64 uploads
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// DB connect
connectDB();
let port = process.env.PORT
const server = app.listen(port, () => {
  console.log("Server running on port 8000");
});

// socket start
initSocket(server);