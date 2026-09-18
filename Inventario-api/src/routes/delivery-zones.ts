import { Router } from "express";
import { DeliveryZoneController } from "../controllers/delivery-zones.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

// Ruta pública: la usa la tienda (app Flutter) para calcular envíos, sin login
router.get("/active", DeliveryZoneController.getActiveDeliveryZones);

// Consulta de zonas (requiere autenticación, ej. panel admin)
router.get("/", verifyToken, DeliveryZoneController.getDeliveryZones);
router.get("/:id", verifyToken, DeliveryZoneController.getDeliveryZoneById);

// Administración de zonas
router.post(
  "/",
  verifyToken,
  isAdmin,
  DeliveryZoneController.createDeliveryZone
);

router.put(
  "/:id",
  verifyToken,
  isAdmin,
  DeliveryZoneController.updateDeliveryZone
);

router.delete(
  "/:id",
  verifyToken,
  isAdmin,
  DeliveryZoneController.deleteDeliveryZone
);

export default router;