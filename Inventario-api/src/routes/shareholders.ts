import { Router } from "express";
import { ShareholderController } from "../controllers/shareholders.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", ShareholderController.getShareholders);

// IMPORTANTE: Pon esta ruta antes de /:id para que Express no confunda "financials" con un ID
router.get("/financials", ShareholderController.getShareholdersFinancials);

router.get("/:id", ShareholderController.getShareholderById);
router.post("/", ShareholderController.createShareholder);
router.put("/:id", ShareholderController.updateShareholder);
router.delete("/:id", ShareholderController.deleteShareholder);

export default router;