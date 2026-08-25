"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchase_items_controller_1 = require("../controllers/purchase-items.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/purchase/:purchaseId", purchase_items_controller_1.PurchaseItemController.getItemsByPurchase);
router.post("/", purchase_items_controller_1.PurchaseItemController.createItem);
exports.default = router;
