import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const cloudinaryService = cloudinary.v2;

cloudinaryService.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinaryService;
