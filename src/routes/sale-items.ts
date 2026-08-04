import { Router } from "express";
import { SaleItemController } from "../controllers/sale-items.controller";

const router = Router();

router.get("/sale/:saleId", SaleItemController.getItemsBySale);
router.post("/", SaleItemController.createItem);

export default router;