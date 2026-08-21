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
      // Tomamos el userId del req.user (corregido a .userId para que coincida con el middleware)
      const userId = (req as any).user?.userId; 

      if (!userId) {
        return res.status(401).json({ error: "Usuario no autenticado o token inválido" });
      }

      // Combinamos el body con el userId obtenido del token
      const saleData = { ...req.body, userId };
      
      const newSale = await SaleService.create(saleData);
      return res.status(201).json(newSale);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al registrar la venta",
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