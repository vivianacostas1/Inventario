import { Request, Response } from "express";
import { PurchaseItemService } from "../services/purchase-items.service";

export class PurchaseItemController {
  static async getItemsByPurchase(req: Request, res: Response) {
    try {
      const { purchaseId } = req.params;
     const items = await PurchaseItemService.getByPurchaseId(String(purchaseId));
      return res.json(items);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los ítems de la compra" });
    }
  }

  static async createItem(req: Request, res: Response) {
    try {
      const newItem = await PurchaseItemService.create(req.body);
      return res.status(201).json(newItem);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al registrar el ítem de compra", 
        details: error.message 
      });
    }
  }
}