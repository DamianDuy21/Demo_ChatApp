import express from "express";
import {
  checkAuth,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const authRoutes = express.Router();

authRoutes.post("/sign-up", signUp);

authRoutes.post("/sign-in", signIn);

authRoutes.post("/sign-out", signOut);

authRoutes.get("/check-auth", protectedRoute, checkAuth); // Use this route when reload the page or things similar to that

export default authRoutes;
