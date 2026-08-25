"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dividends_controller_1 = require("../controllers/dividends.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", dividends_controller_1.DividendController.getDividends);
router.get("/:id", dividends_controller_1.DividendController.getDividendById);
router.post("/", dividends_controller_1.DividendController.createDividend);
router.put("/:id", dividends_controller_1.DividendController.updateDividend);
router.delete("/:id", dividends_controller_1.DividendController.deleteDividend);
exports.default = router;
