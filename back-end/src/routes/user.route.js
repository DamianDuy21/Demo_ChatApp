import express from "express";
import { updateProfile } from "../controllers/user.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.put("/update-profile", protectedRoute, updateProfile);

export default userRoutes;
