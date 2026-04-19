import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event-brochures",       // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "pdf", "webp"],
    transformation: [{ width: 1200, crop: "limit" }], // optional resize
  },
});

export const upload = multer({ storage });