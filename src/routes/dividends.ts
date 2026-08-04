import { Router } from "express";
import { DividendController } from "../controllers/dividends.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", DividendController.getDividends);
router.get("/:id", DividendController.getDividendById);
router.post("/", DividendController.createDividend);
router.put("/:id", DividendController.updateDividend);
router.delete("/:id", DividendController.deleteDividend);

export default router;