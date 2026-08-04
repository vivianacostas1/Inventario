import { Router } from "express";
import { SaleController } from "../controllers/sales.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", SaleController.getSales);
router.get("/:id", SaleController.getSaleById);
router.post("/", SaleController.createSale);
router.patch("/:id/status", SaleController.updateStatus);

export default router;