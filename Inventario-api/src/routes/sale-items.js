"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sale_items_controller_1 = require("../controllers/sale-items.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/sale/:saleId", sale_items_controller_1.SaleItemController.getItemsBySale);
router.post("/", sale_items_controller_1.SaleItemController.createItem);
exports.default = router;
