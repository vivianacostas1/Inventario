import { Router } from "express";
import { SaleController } from "../controllers/sales.controller";

const router = Router();

router.get("/", SaleController.getSales);
router.get("/:id", SaleController.getSaleById);
router.post("/", SaleController.createSale);
router.patch("/:id/status", SaleController.updateStatus);

export default router;