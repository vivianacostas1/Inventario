import { Router, Request, Response } from 'express';
import upload from '../middlewares/upload'; 
import cloudinary from '../cloudinary'; // O ponle la ruta correcta si tu archivo cloudinary.ts está en otra carpeta
const router = Router();

router.post('/upload', upload.single('imagen'), async (req: Request, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ninguna imagen' });
    }

    // Función auxiliar tipada para subir mediante un stream
    const streamUpload = (fileBuffer: Buffer): Promise<any> => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error: any, result: any) => { // <-- Agregamos los tipos aquí
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(fileBuffer);
      });
    };

    const resultado = await streamUpload(req.file.buffer);

    return res.json({
      message: '¡Imagen subida con éxito!',
      url: resultado.secure_url,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al subir la imagen a Cloudinary' });
  }
});

export default router;