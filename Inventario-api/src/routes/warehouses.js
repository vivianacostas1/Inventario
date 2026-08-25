"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const warehouses_controller_1 = require("../controllers/warehouses.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", warehouses_controller_1.WarehouseController.getWarehouses);
router.get("/:id", warehouses_controller_1.WarehouseController.getWarehouseById);
router.post("/", warehouses_controller_1.WarehouseController.createWarehouse);
router.put("/:id", warehouses_controller_1.WarehouseController.updateWarehouse);
router.delete("/:id", warehouses_controller_1.WarehouseController.deleteWarehouse);
exports.default = router;
