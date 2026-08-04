import { Request, Response } from "express";
import { SaleService } from "../services/sales.service";

export class SaleController {
  static async getSales(req: Request, res: Response) {
    try {
      const sales = await SaleService.getAll();
      return res.json(sales);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las ventas" });
    }
  }

  static async getSaleById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const sale = await SaleService.getById(id);
      if (!sale) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }
      return res.json(sale);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la venta" });
    }
  }

  static async createSale(req: Request, res: Response) {
    try {
      const newSale = await SaleService.create(req.body);
      return res.status(201).json(newSale);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al registrar la venta (verifique IDs de usuario, cliente y productos válidos)",
        details: error.message 
      });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const updatedSale = await SaleService.updateStatus(id, status);
      return res.json(updatedSale);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Error al actualizar el estado de la venta" });
    }
  }
}