import { Request, Response } from "express";
import { ShareholderProductService } from "../services/shareholder-products.service";

export class ShareholderProductController {
  static async getAssignments(req: Request, res: Response) {
    try {
      const assignments = await ShareholderProductService.getAll();
      return res.json(assignments);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las asignaciones" });
    }
  }

  static async assignProduct(req: Request, res: Response) {
    try {
      const assignment = await ShareholderProductService.assignProduct(req.body);
      return res.status(201).json(assignment);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al asignar el producto al accionista (es posible que ya esté asignado)",
        details: error.message 
      });
    }
  }

  static async removeAssignment(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await ShareholderProductService.removeAssignment(id);
      return res.json({ message: "Asignación eliminada correctamente" });
    } catch (error) {
      return res.status(400).json({ error: "No se pudo eliminar la asignación o no existe" });
    }
  }
}