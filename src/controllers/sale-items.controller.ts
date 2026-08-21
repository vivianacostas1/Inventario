import { Request, Response } from "express";
import { SaleItemService } from "../services/sale-items.service";

export class SaleItemController {
  static async getItemsBySale(req: Request, res: Response) {
    try {
      const saleId = String(req.params.saleId);
      const items = await SaleItemService.getBySaleId(saleId);
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los ítems de la venta" });
    }
  }

  static async createItem(req: Request, res: Response) {
    try {
      const newItem = await SaleItemService.create(req.body);
      return res.status(201).json(newItem);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al registrar el ítem de venta", 
        details: error.message 
      });
    }
  }
}