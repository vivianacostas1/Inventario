import { Request, Response } from "express";
import { ProductAnalyticsService } from "../services/product-analytics.service";

export class ProductAnalyticsController {
  static async getAllAnalytics(req: Request, res: Response) {
    try {
      const analytics = await ProductAnalyticsService.getAll();
      return res.json(analytics);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los análisis de productos" });
    }
  }

  static async getAnalyticsByProduct(req: Request, res: Response) {
    try {
      const productId = String(req.params.productId);
      const analytics = await ProductAnalyticsService.getByProductId(productId);
      return res.json(analytics);
    } catch (error: any) {
      return res.status(404).json({ error: error.message || "Error al obtener el análisis" });
    }
  }

  static async updateAnalytics(req: Request, res: Response) {
    try {
      const productId = String(req.params.productId);
      const updated = await ProductAnalyticsService.update(productId, req.body);
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ error: "Error al actualizar el análisis", details: error.message });
    }
  }
}