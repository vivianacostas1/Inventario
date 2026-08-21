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
      // Recogemos el productId de los parámetros de la ruta y el shareholderId/quantity del body
      const { productId } = req.params;
      const { shareholderId, quantity } = req.body;

      const assignmentData = {
        productId: productId || req.body.productId,
        shareholderId,
        quantity: quantity !== undefined ? parseInt(quantity) : 0,
      };

      const assignment = await ShareholderProductService.assignProduct(assignmentData);
      return res.status(201).json({
        message: "Producto asignado o actualizado correctamente al accionista",
        assignment,
      });
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al asignar el producto al accionista",
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