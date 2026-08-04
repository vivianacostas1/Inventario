import { Router } from "express";
import { ProductAnalyticsController } from "../controllers/product-analytics.controller";

const router = Router();

router.get("/", ProductAnalyticsController.getAllAnalytics);
router.get("/product/:productId", ProductAnalyticsController.getAnalyticsByProduct);
router.put("/product/:productId", ProductAnalyticsController.updateAnalytics);

export default router;