"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sales_controller_1 = require("../controllers/sales.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", sales_controller_1.SaleController.getSales);
router.get("/:id", sales_controller_1.SaleController.getSaleById);
router.post("/", sales_controller_1.SaleController.createSale);
router.patch("/:id/status", sales_controller_1.SaleController.updateStatus);
exports.default = router;
