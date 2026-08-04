import { Router } from "express";
import { ShareholderProductController } from "../controllers/shareholder-products.controller";

const router = Router();

router.get("/", ShareholderProductController.getAssignments);
router.post("/", ShareholderProductController.assignProduct);
router.delete("/:id", ShareholderProductController.removeAssignment);

export default router;