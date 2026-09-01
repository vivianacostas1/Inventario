import { Router } from "express";
import { ProductController } from "../controllers/products.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.use(verifyToken);

router.get("/", ProductController.getProducts);

router.get(
  "/next-sku",
  ProductController.getNextSku
);

router.get(
  "/:id",
  ProductController.getProductById
);

router.post(
  "/",
  upload.single("imagen"),
  ProductController.createProduct
);

router.put(
  "/:id",
  upload.single("imagen"),
  ProductController.updateProduct
);

router.delete(
  "/:id",
  ProductController.deleteProduct
);

export default router;
