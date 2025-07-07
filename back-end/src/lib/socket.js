import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust this to your front-end URL
  },
});

export const getReceiverSocketId = (userId) => {
  return userSocketMap[userId] || null; // Returns the socket ID for the given userId
};

const userSocketMap = {}; // Stores online users {userId: socketId}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  const userId = socket.handshake.query.userId; // Assuming userId is sent as a query parameter
  if (userId) {
    userSocketMap[userId] = socket.id; // Map userId to socketId
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit online users to all clients

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userSocketMap[userId]; // Remove user from online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated online users to all clients
  });
});

export { io, app, server };
