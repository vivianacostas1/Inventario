import { Router } from "express";
import { StockMovementController } from "../controllers/stock-movements.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", StockMovementController.getMovements);
router.get("/:id", StockMovementController.getMovementById);
router.post("/", StockMovementController.createMovement);

export default router;