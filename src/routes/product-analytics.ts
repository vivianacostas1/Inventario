import { Router } from "express";
import { ProductAnalyticsController } from "../controllers/product-analytics.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", ProductAnalyticsController.getAllAnalytics);
router.get("/product/:productId", ProductAnalyticsController.getAnalyticsByProduct);
router.put("/product/:productId", ProductAnalyticsController.updateAnalytics);

export default router;