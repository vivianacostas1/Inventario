import { Router } from "express";
import { StockController } from "../controllers/stocks.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", StockController.getStock);
router.post("/", StockController.upsertStock);

router.get("/movements", StockController.getMovements);
router.post("/movements", StockController.createMovement);

export default router;