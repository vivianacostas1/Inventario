import { Router } from "express";
import { WarehouseController } from "../controllers/warehouses.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(verifyToken);

router.get("/", WarehouseController.getWarehouses);
router.get("/:id", WarehouseController.getWarehouseById);
router.post("/", WarehouseController.createWarehouse);
router.put("/:id", WarehouseController.updateWarehouse);
router.delete("/:id", WarehouseController.deleteWarehouse);

export default router;