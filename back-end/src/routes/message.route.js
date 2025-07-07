import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRoutes = express.Router();

messageRoutes.get("/users", protectedRoute, getUsersForSidebar);
messageRoutes.get("/:id", protectedRoute, getMessages);
messageRoutes.post("/send/:id", protectedRoute, sendMessage);

export default messageRoutes;
