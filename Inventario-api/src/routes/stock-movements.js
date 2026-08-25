"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_movements_controller_1 = require("../controllers/stock-movements.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", stock_movements_controller_1.StockMovementController.getMovements);
router.get("/:id", stock_movements_controller_1.StockMovementController.getMovementById);
router.post("/", stock_movements_controller_1.StockMovementController.createMovement);
exports.default = router;
