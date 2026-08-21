import { Router } from "express";
import { SupplierController } from "../controllers/suppliers.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", SupplierController.getSuppliers);
router.get("/:id", SupplierController.getSupplierById);
router.post("/", SupplierController.createSupplier);
router.put("/:id", SupplierController.updateSupplier);
router.delete("/:id", SupplierController.deleteSupplier);

export default router;