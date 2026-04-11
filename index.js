import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/authRoute.js";
import messageRoutes from "./src/routes/messageRoute.js";
import { initSocket } from "./src/socket/socket.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// DB connect
connectDB();

const server = app.listen(8000, () => {
  console.log("Server running on port 8000");
});

// socket start
initSocket(server);