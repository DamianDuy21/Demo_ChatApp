import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id; // Assuming req.user is set by the protectedRoute middleware

    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    // Find the user by ID and update the profile picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url }, // Use the secure URL from Cloudinary
      { new: true, runValidators: true } // Return the updated user and validate the update. If not using this, it will return the data before updated
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic, // Return the updated profile picture URL
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
