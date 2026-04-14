import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) socket.join(userId); // User ko unki ID ke room mein join karayein

    socket.on("sendMessage", (data) => {
      // Message sirf receiverId wale room ko bhejien
      io.to(data.receiverId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};