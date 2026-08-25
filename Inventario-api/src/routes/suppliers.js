"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const suppliers_controller_1 = require("../controllers/suppliers.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", suppliers_controller_1.SupplierController.getSuppliers);
router.get("/:id", suppliers_controller_1.SupplierController.getSupplierById);
router.post("/", suppliers_controller_1.SupplierController.createSupplier);
router.put("/:id", suppliers_controller_1.SupplierController.updateSupplier);
router.delete("/:id", suppliers_controller_1.SupplierController.deleteSupplier);
exports.default = router;
