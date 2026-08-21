import { Router } from "express";
import { ShareholderProductController } from "../controllers/shareholder-products.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", ShareholderProductController.getAssignments);
router.post("/", ShareholderProductController.assignProduct);

// Ruta para asignar/actualizar cantidad directamente desde la pantalla de productos
router.post("/products/:productId/assign-shareholder", ShareholderProductController.assignProduct);

router.delete("/:id", ShareholderProductController.removeAssignment);

export default router;