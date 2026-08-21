import { Request, Response } from "express";
import { ShareholderService } from "../services/shareholders.service";

export class ShareholderController {
  static async getShareholders(req: Request, res: Response) {
    try {
      const shareholders = await ShareholderService.getAll();
      return res.json(shareholders);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los accionistas" });
    }
  }

  static async getShareholderById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const shareholder = await ShareholderService.getById(id);
      if (!shareholder) {
        return res.status(404).json({ error: "Accionista no encontrado" });
      }
      return res.json(shareholder);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el accionista" });
    }
  }

  static async createShareholder(req: Request, res: Response) {
    try {
      const newShareholder = await ShareholderService.create(req.body);
      return res.status(201).json(newShareholder);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al crear el accionista (verifique que el correo no esté duplicado)",
        details: error.message 
      });
    }
  }

  static async updateShareholder(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updatedShareholder = await ShareholderService.update(id, req.body);
      return res.json(updatedShareholder);
    } catch (error) {
      return res.status(400).json({ error: "Error al actualizar el accionista" });
    }
  }

  static async deleteShareholder(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await ShareholderService.delete(id);
      return res.json({ message: "Accionista desactivado correctamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el accionista" });
    }
  }

  // NUEVO MÉTODO: Conecta con el servicio para devolver los datos al modal del frontend
  static async getShareholdersFinancials(req: Request, res: Response) {
    try {
      const financials = await ShareholderService.getFinancialSummary();
      return res.json(financials);
    } catch (error) {
      console.error("Error al obtener finanzas de accionistas:", error);
      return res.status(500).json({ error: "Error al calcular el capital y las ganancias de los accionistas" });
    }
  }
}