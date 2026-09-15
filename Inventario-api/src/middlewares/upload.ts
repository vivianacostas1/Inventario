import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          `El archivo "${file.originalname}" no es una imagen válida.`
        )
      );
    }

    cb(null, true);
  },
});

export default upload;
