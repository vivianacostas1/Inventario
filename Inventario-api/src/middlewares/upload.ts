import multer from 'multer';

// Almacenamiento en memoria para procesar el archivo antes de enviarlo a la nube
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default upload;