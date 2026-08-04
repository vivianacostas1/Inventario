import { Router } from "express";
import { DividendController } from "../controllers/dividends.controller";

const router = Router();

router.get("/", DividendController.getDividends);
router.get("/:id", DividendController.getDividendById);
router.post("/", DividendController.createDividend);
router.put("/:id", DividendController.updateDividend);
router.delete("/:id", DividendController.deleteDividend);

export default router;