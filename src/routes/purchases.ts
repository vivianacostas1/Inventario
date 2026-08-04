import { Router } from "express";
import { PurchaseController } from "../controllers/purchases.controller";

const router = Router();

router.get("/", PurchaseController.getPurchases);
router.get("/:id", PurchaseController.getPurchaseById);
router.post("/", PurchaseController.createPurchase);
router.patch("/:id/status", PurchaseController.updateStatus);

export default router;