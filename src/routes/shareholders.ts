import { Router } from "express";
import { ShareholderController } from "../controllers/shareholders.controller";

const router = Router();

router.get("/", ShareholderController.getShareholders);
router.get("/:id", ShareholderController.getShareholderById);
router.post("/", ShareholderController.createShareholder);
router.put("/:id", ShareholderController.updateShareholder);
router.delete("/:id", ShareholderController.deleteShareholder);

export default router;