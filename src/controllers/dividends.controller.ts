import { Request, Response } from "express";
import { DividendService } from "../services/dividends.service";

export class DividendController {
  static async getDividends(req: Request, res: Response) {
    try {
      const dividends = await DividendService.getAll();
      return res.json(dividends);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los dividendos" });
    }
  }

  static async getDividendById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const dividend = await DividendService.getById(id);
      if (!dividend) {
        return res.status(404).json({ error: "Dividendo no encontrado" });
      }
      return res.json(dividend);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el dividendo" });
    }
  }

  static async createDividend(req: Request, res: Response) {
    try {
      const newDividend = await DividendService.create(req.body);
      return res.status(201).json(newDividend);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al registrar el dividendo (verifique que el accionista y el producto existan)",
        details: error.message 
      });
    }
  }

  static async updateDividend(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updatedDividend = await DividendService.update(id, req.body);
      return res.json(updatedDividend);
    } catch (error) {
      return res.status(400).json({ error: "Error al actualizar el dividendo" });
    }
  }

  static async deleteDividend(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await DividendService.delete(id);
      return res.json({ message: "Dividendo eliminado correctamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el dividendo" });
    }
  }
}