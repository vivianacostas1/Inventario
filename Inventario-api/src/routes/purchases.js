"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const purchases_controller_1 = require("../controllers/purchases.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", purchases_controller_1.PurchaseController.getPurchases);
router.get("/:id", purchases_controller_1.PurchaseController.getPurchaseById);
router.post("/", purchases_controller_1.PurchaseController.createPurchase);
router.patch("/:id/status", purchases_controller_1.PurchaseController.updateStatus);
exports.default = router;
