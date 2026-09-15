import { Router } from "express";
import { ProductController } from "../controllers/products.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload";

const router = Router();

// ============================================================
// PROTEGER TODAS LAS RUTAS DE PRODUCTOS
// ============================================================

router.use(verifyToken);

// ============================================================
// PRODUCTOS
// ============================================================

// Obtener todos los productos
router.get(
  "/",
  ProductController.getProducts
);

// Obtener siguiente SKU
router.get(
  "/next-sku",
  ProductController.getNextSku
);

// Obtener producto por ID
router.get(
  "/:id",
  ProductController.getProductById
);

// ============================================================
// CREAR PRODUCTO + IMÁGENES
// ============================================================

router.post(
  "/",
  upload.array("imagenes", 10),
  ProductController.createProduct
);

// ============================================================
// ACTUALIZAR PRODUCTO + IMÁGENES
// ============================================================

router.put(
  "/:id",
  upload.array("imagenes", 10),
  ProductController.updateProduct
);

// ============================================================
// ELIMINAR / DESACTIVAR PRODUCTO
// ============================================================

router.delete(
  "/:id",
  ProductController.deleteProduct
);

export default router;
