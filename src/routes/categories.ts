import { Router } from "express";
import { CategoryController } from "../controllers/categories.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", verifyToken, CategoryController.getCategories);
router.get("/:id", verifyToken, CategoryController.getCategoryById);
router.post("/", verifyToken, CategoryController.createCategory);
router.put("/:id", verifyToken, CategoryController.updateCategory);
router.delete("/:id", verifyToken, CategoryController.deleteCategory);

export default router;