"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controller_1 = require("../controllers/categories.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.verifyToken, categories_controller_1.CategoryController.getCategories);
router.get("/:id", auth_middleware_1.verifyToken, categories_controller_1.CategoryController.getCategoryById);
// Agrega isAdmin aquí para que solo los administradores puedan crear, actualizar y borrar
router.post("/", auth_middleware_1.verifyToken, role_middleware_1.isAdmin, categories_controller_1.CategoryController.createCategory);
router.put("/:id", auth_middleware_1.verifyToken, role_middleware_1.isAdmin, categories_controller_1.CategoryController.updateCategory);
router.delete("/:id", auth_middleware_1.verifyToken, role_middleware_1.isAdmin, categories_controller_1.CategoryController.deleteCategory);
exports.default = router;
