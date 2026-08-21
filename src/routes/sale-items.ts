import { Router } from "express";
import { SaleItemController } from "../controllers/sale-items.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/sale/:saleId", SaleItemController.getItemsBySale);
router.post("/", SaleItemController.createItem);

export default router;