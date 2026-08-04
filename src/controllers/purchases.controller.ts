import { Request, Response } from "express";
import { PurchaseService } from "../services/purchases.service";

export class PurchaseController {
  static async getPurchases(req: Request, res: Response) {
    try {
      const purchases = await PurchaseService.getAll();
      return res.json(purchases);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener las compras" });
    }
  }

  static async getPurchaseById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const purchase = await PurchaseService.getById(id);
      if (!purchase) {
        return res.status(404).json({ error: "Compra no encontrada" });
      }
      return res.json(purchase);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener la compra" });
    }
  }

  static async createPurchase(req: Request, res: Response) {
    try {
      const newPurchase = await PurchaseService.create(req.body);
      return res.status(201).json(newPurchase);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al registrar la compra (verifique IDs de proveedor, usuario y productos válidos)",
        details: error.message 
      });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      const updatedPurchase = await PurchaseService.updateStatus(id, status);
      return res.json(updatedPurchase);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Error al actualizar el estado de la compra" });
    }
  }
}