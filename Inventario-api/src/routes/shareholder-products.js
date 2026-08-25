"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shareholder_products_controller_1 = require("../controllers/shareholder-products.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", shareholder_products_controller_1.ShareholderProductController.getAssignments);
router.post("/", shareholder_products_controller_1.ShareholderProductController.assignProduct);
// Ruta para asignar/actualizar cantidad directamente desde la pantalla de productos
router.post("/products/:productId/assign-shareholder", shareholder_products_controller_1.ShareholderProductController.assignProduct);
router.delete("/:id", shareholder_products_controller_1.ShareholderProductController.removeAssignment);
exports.default = router;
