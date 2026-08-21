import { Request, Response } from "express";
import { CategoryService } from "../services/categories.service";

export class CategoryController {
  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await CategoryService.getAll();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las categorías" });
    }
  }

  static async getCategoryById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const category = await CategoryService.getById(id);
      if (!category) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }
      return res.json(category);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la categoría" });
    }
  }

  static async createCategory(req: Request, res: Response) {
    try {
      const newCategory = await CategoryService.create(req.body);
      return res.status(201).json(newCategory);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al crear la categoría (verifique que el nombre no esté duplicado)",
        details: error.message 
      });
    }
  }

  static async updateCategory(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updatedCategory = await CategoryService.update(id, req.body);
      return res.json(updatedCategory);
    } catch (error) {
      return res.status(400).json({ error: "Error al actualizar la categoría" });
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await CategoryService.delete(id);
      return res.json({ message: "Categoría eliminada correctamente" });
    } catch (error: any) {
      return res.status(400).json({ 
        error: "No se puede eliminar la categoría porque tiene productos asociados o no existe" 
      });
    }
  }
}