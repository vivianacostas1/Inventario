"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shareholders_controller_1 = require("../controllers/shareholders.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
router.get("/", shareholders_controller_1.ShareholderController.getShareholders);
// IMPORTANTE: Pon esta ruta antes de /:id para que Express no confunda "financials" con un ID
router.get("/financials", shareholders_controller_1.ShareholderController.getShareholdersFinancials);
router.get("/:id", shareholders_controller_1.ShareholderController.getShareholderById);
router.post("/", shareholders_controller_1.ShareholderController.createShareholder);
router.put("/:id", shareholders_controller_1.ShareholderController.updateShareholder);
router.delete("/:id", shareholders_controller_1.ShareholderController.deleteShareholder);
exports.default = router;
