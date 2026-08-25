"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customers_controller_1 = require("../controllers/customers.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", customers_controller_1.CustomerController.getCustomers);
router.get("/:id", customers_controller_1.CustomerController.getCustomerById);
router.post("/", customers_controller_1.CustomerController.createCustomer);
router.put("/:id", customers_controller_1.CustomerController.updateCustomer);
router.delete("/:id", customers_controller_1.CustomerController.deleteCustomer);
exports.default = router;
