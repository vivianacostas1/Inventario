import { Router } from "express";
import { SupplierController } from "../controllers/suppliers.controller";

const router = Router();

router.get("/", SupplierController.getSuppliers);
router.get("/:id", SupplierController.getSupplierById);
router.post("/", SupplierController.createSupplier);
router.put("/:id", SupplierController.updateSupplier);
router.delete("/:id", SupplierController.deleteSupplier);

export default router;