"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const categories_service_1 = require("../services/categories.service");
class CategoryController {
    static async getCategories(req, res) {
        try {
            const categories = await categories_service_1.CategoryService.getAll();
            return res.json(categories);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener las categorías" });
        }
    }
    static async getCategoryById(req, res) {
        try {
            const id = String(req.params.id);
            const category = await categories_service_1.CategoryService.getById(id);
            if (!category) {
                return res.status(404).json({ error: "Categoría no encontrada" });
            }
            return res.json(category);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener la categoría" });
        }
    }
    static async createCategory(req, res) {
        try {
            const newCategory = await categories_service_1.CategoryService.create(req.body);
            return res.status(201).json(newCategory);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al crear la categoría (verifique que el nombre no esté duplicado)",
                details: error.message
            });
        }
    }
    static async updateCategory(req, res) {
        try {
            const id = String(req.params.id);
            const updatedCategory = await categories_service_1.CategoryService.update(id, req.body);
            return res.json(updatedCategory);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar la categoría" });
        }
    }
    static async deleteCategory(req, res) {
        try {
            const id = String(req.params.id);
            await categories_service_1.CategoryService.delete(id);
            return res.json({ message: "Categoría eliminada correctamente" });
        }
        catch (error) {
            return res.status(400).json({
                error: "No se puede eliminar la categoría porque tiene productos asociados o no existe"
            });
        }
    }
}
exports.CategoryController = CategoryController;
