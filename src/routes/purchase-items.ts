import { Router } from "express";
import { PurchaseItemController } from "../controllers/purchase-items.controller";

const router = Router();

router.get("/purchase/:purchaseId", PurchaseItemController.getItemsByPurchase);
router.post("/", PurchaseItemController.createItem);

export default router;