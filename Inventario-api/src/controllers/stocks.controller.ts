import { Request, Response } from "express";
import { StockService } from "../services/stocks.service";

export class StockController {
  static async getStock(req: Request, res: Response) {
    try {
      const stock = await StockService.getAllStock();
      return res.json(stock);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el stock" });
    }
  }

  static async upsertStock(req: Request, res: Response) {
    try {
      const stock = await StockService.upsertStock(req.body);
      return res.status(201).json(stock);
    } catch (error: any) {
      return res.status(400).json({ error: "Error al actualizar el stock", details: error.message });
    }
  }

  static async getMovements(req: Request, res: Response) {
    try {
      const movements = await StockService.getAllMovements();
      return res.json(movements);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los movimientos de stock" });
    }
  }

  static async createMovement(req: Request, res: Response) {
    try {
      const movement = await StockService.createMovement(req.body);
      return res.status(201).json(movement);
    } catch (error: any) {
      return res.status(400).json({ error: "Error al registrar el movimiento de stock", details: error.message });
    }
  }
}