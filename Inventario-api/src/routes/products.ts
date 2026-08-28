import { Router } from "express";
import { ProductController } from "../controllers/products.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", ProductController.getProducts);
router.get("/next-sku", ProductController.getNextSku); // <-- ¡Movido arriba de :id!
router.get("/:id", ProductController.getProductById);
router.post("/", ProductController.createProduct);
router.put("/:id", ProductController.updateProduct);
router.delete("/:id", ProductController.deleteProduct);

export default router;