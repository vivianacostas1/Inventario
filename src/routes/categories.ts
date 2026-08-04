import { Router } from "express";
import { CategoryController } from "../controllers/categories.controller";

const router = Router();

router.get("/", CategoryController.getCategories);
router.get("/:id", CategoryController.getCategoryById);
router.post("/", CategoryController.createCategory);
router.put("/:id", CategoryController.updateCategory);
router.delete("/:id", CategoryController.deleteCategory);

export default router;