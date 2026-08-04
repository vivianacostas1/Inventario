import { Router } from "express";
import { StockMovementController } from "../controllers/stock-movements.controller";

const router = Router();

router.get("/", StockMovementController.getMovements);
router.get("/:id", StockMovementController.getMovementById);
router.post("/", StockMovementController.createMovement);

export default router;