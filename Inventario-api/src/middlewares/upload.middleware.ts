import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// ============================================================
// STORAGE CLOUDINARY
// ============================================================

const storage = new CloudinaryStorage({
  cloudinary,

  params: async () => ({
    folder: "inventario/productos",
    resource_type: "image",

    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ],
  }),
});

// ============================================================
// MULTER
// ============================================================

const upload = multer({
  storage,

  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (
    req,
    file,
    callback
  ) => {

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Solo se permiten imágenes JPG, JPEG, PNG o WEBP."
        )
      );
    }
  },
});

export default upload;