import { Router } from "express";
import { PurchaseItemController } from "../controllers/purchase-items.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/purchase/:purchaseId", PurchaseItemController.getItemsByPurchase);
router.post("/", PurchaseItemController.createItem);

export default router;