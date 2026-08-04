import { Router } from "express";
import { StockController } from "../controllers/stocks.controller";

const router = Router();

router.get("/", StockController.getStock);
router.post("/", StockController.upsertStock);

router.get("/movements", StockController.getMovements);
router.post("/movements", StockController.createMovement);

export default router;