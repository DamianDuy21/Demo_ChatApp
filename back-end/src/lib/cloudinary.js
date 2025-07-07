import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv"; // can import dotenv from "dotenv"; and use dotenv.config() also

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
