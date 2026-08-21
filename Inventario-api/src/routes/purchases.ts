import { Router } from "express";
import { PurchaseController } from "../controllers/purchases.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", PurchaseController.getPurchases);
router.get("/:id", PurchaseController.getPurchaseById);
router.post("/", PurchaseController.createPurchase);
router.patch("/:id/status", PurchaseController.updateStatus);

export default router;