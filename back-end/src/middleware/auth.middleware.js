import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // with jwt is the token's name in cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(decoded.id).select("-password -__v");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user; // Attach user to request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Authentication error in middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
