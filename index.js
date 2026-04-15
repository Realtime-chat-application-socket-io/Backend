import express from "express";
import cors from "cors";
import  connectDB  from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import { initSocket } from "./socket/socket.js";
import dotenv from "dotenv"


dotenv.config()

const app = express();

app.use(cors({
  origin: "https://pingchatify.netlify.app", // your frontend
  credentials: true,
}));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// DB connect
connectDB();
let port = process.env.PORT
const server = app.listen(port, () => {
  console.log("Server running on port 8000");
});

// socket start
initSocket(server);