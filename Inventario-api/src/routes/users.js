"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", users_controller_1.UserController.getUsers);
router.get("/:id", users_controller_1.UserController.getUserById);
router.post("/", users_controller_1.UserController.createUser);
router.put("/:id", users_controller_1.UserController.updateUser);
router.delete("/:id", users_controller_1.UserController.deleteUser);
exports.userRoutes = router;
