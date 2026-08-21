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
      // Tomamos los datos del body y nos aseguramos de capturar el shareholderId y el userId
      const purchaseData = {
        ...req.body,
        // Si tu sistema usa middleware de autenticación, obtén el ID del usuario de req.user. 
        // Si viene en el body, déjalo como req.body.userId
        userId: (req as any).user?.id || req.body.userId,
        shareholderId: req.body.shareholderId || null,
      };

      const newPurchase = await PurchaseService.create(purchaseData);
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
      const { status, warehouseId } = req.body; // Opcionalmente podemos recibir warehouseId si se envía
      const updatedPurchase = await PurchaseService.updateStatus(id, status, warehouseId);
      return res.json(updatedPurchase);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Error al actualizar el estado de la compra" });
    }
  }
}