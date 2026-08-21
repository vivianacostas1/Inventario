import { Router } from "express";
import { CategoryController } from "../controllers/categories.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/role.middleware";

const router = Router();

router.get("/", verifyToken, CategoryController.getCategories);
router.get("/:id", verifyToken, CategoryController.getCategoryById);

// Agrega isAdmin aquí para que solo los administradores puedan crear, actualizar y borrar
router.post("/", verifyToken, isAdmin, CategoryController.createCategory);
router.put("/:id", verifyToken, isAdmin, CategoryController.updateCategory);
router.delete("/:id", verifyToken, isAdmin, CategoryController.deleteCategory);

export default router;