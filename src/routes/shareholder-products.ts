import { Router } from "express";
import { ShareholderProductController } from "../controllers/shareholder-products.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", ShareholderProductController.getAssignments);
router.post("/", ShareholderProductController.assignProduct);
router.delete("/:id", ShareholderProductController.removeAssignment);

export default router;