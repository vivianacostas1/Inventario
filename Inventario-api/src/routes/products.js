"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("../controllers/products.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", products_controller_1.ProductController.getProducts);
router.get("/:id", products_controller_1.ProductController.getProductById);
router.post("/", products_controller_1.ProductController.createProduct);
router.put("/:id", products_controller_1.ProductController.updateProduct);
router.get("/next-sku", products_controller_1.ProductController.getNextSku);
router.delete("/:id", products_controller_1.ProductController.deleteProduct);
exports.default = router;
