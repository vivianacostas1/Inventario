import { Router } from "express";
import { DeliveryZoneController } from "../controllers/delivery-zones.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Consulta de zonas
router.get("/", DeliveryZoneController.getDeliveryZones);
router.get("/active", DeliveryZoneController.getActiveDeliveryZones);
router.get("/:id", DeliveryZoneController.getDeliveryZoneById);

// Administración de zonas
router.post(
  "/",
  isAdmin,
  DeliveryZoneController.createDeliveryZone
);

router.put(
  "/:id",
  isAdmin,
  DeliveryZoneController.updateDeliveryZone
);

router.delete(
  "/:id",
  isAdmin,
  DeliveryZoneController.deleteDeliveryZone
);

export default router;