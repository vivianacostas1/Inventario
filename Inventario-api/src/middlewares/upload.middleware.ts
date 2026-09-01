import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "inventario/productos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  } as any,
});

export const upload = multer({
  storage,
});