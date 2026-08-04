import { Router } from "express";
import { WarehouseController } from "../controllers/warehouses.controller";

const router = Router();

router.get("/", WarehouseController.getWarehouses);
router.get("/:id", WarehouseController.getWarehouseById);
router.post("/", WarehouseController.createWarehouse);
router.put("/:id", WarehouseController.updateWarehouse);
router.delete("/:id", WarehouseController.deleteWarehouse);

export default router;