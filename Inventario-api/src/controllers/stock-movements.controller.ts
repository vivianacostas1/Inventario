import { Request, Response } from "express";
import { StockMovementService } from "../services/stock-movements.service";

export class StockMovementController {
  static async getMovements(req: Request, res: Response) {
    try {
      const movements = await StockMovementService.getAll();
      return res.json(movements);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los movimientos de stock" });
    }
  }

  static async getMovementById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const movement = await StockMovementService.getById(id);
      if (!movement) {
        return res.status(404).json({ error: "Movimiento de stock no encontrado" });
      }
      return res.json(movement);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el movimiento de stock" });
    }
  }

  static async createMovement(req: Request, res: Response) {
    try {
      const newMovement = await StockMovementService.create(req.body);
      return res.status(201).json(newMovement);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al registrar el movimiento de stock (verifique IDs de almacén, producto y usuario)", 
        details: error.message 
      });
    }
  }
}