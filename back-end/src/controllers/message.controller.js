import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const signedInUserId = req.user._id; // Get the signed-in user's ID from the request object
    const otherUsers = await User.find({ _id: { $ne: signedInUserId } }) // Find all users except the signed-in user
      .select("-password -__v"); // Exclude password and version field from the response

    res.status(200).json({
      message: "Users fetched successfully",
      users: otherUsers, // Return the list of other users
    });
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = new mongoose.Types.ObjectId(req.user._id);
    const receiverId = new mongoose.Types.ObjectId(req.params.id);

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages fetched successfully",
      data: { messages },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params; // Get the user ID from the request parameters
    const senderId = req.user._id; // Get the signed-in user's ID from the request object
    const { text, image } = req.body; // Get the message text from the request body
    let imageUrl;
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image);
      imageUrl = uploadedImage.secure_url; // Get the secure URL of the uploaded image
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // Emit the new message to the receiver's socket
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage, // Return the newly created message
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
