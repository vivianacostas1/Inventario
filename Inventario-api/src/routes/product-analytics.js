"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_analytics_controller_1 = require("../controllers/product-analytics.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", product_analytics_controller_1.ProductAnalyticsController.getAllAnalytics);
router.get("/product/:productId", product_analytics_controller_1.ProductAnalyticsController.getAnalyticsByProduct);
router.put("/product/:productId", product_analytics_controller_1.ProductAnalyticsController.updateAnalytics);
exports.default = router;
