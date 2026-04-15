import { Server } from "socket.io";

export let io;
const userSocketMap = {}; // { userId: [socketId, socketId] }

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId] || [];
};

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://pingchatify.netlify.app"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    const userId = socket.handshake.query.userId;
    if (userId && userId !== "undefined") {
      if (!userSocketMap[userId]) userSocketMap[userId] = [];
      userSocketMap[userId].push(socket.id);
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (userId && userSocketMap[userId]) {
        userSocketMap[userId] = userSocketMap[userId].filter(id => id !== socket.id);
        if (userSocketMap[userId].length === 0) {
          delete userSocketMap[userId];
        }
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
};