import { Server } from "socket.io";
import cors from "cors"

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173", // dev frontend
        "https://pingchatify.netlify.app" // (optional production)
      ],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      socket.join(userId);
    }

    socket.on("sendMessage", (data) => {
      io.to(data.receiverId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};