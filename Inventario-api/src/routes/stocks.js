"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stocks_controller_1 = require("../controllers/stocks.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", stocks_controller_1.StockController.getStock);
router.post("/", stocks_controller_1.StockController.upsertStock);
router.get("/movements", stocks_controller_1.StockController.getMovements);
router.post("/movements", stocks_controller_1.StockController.createMovement);
exports.default = router;
