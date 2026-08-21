import { Request, Response } from "express";
import { WarehouseService } from "../services/warehouses.service";

export class WarehouseController {
  static async getWarehouses(req: Request, res: Response) {
    try {
      const warehouses = await WarehouseService.getAll();
      return res.json(warehouses);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los almacenes" });
    }
  }

  static async getWarehouseById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const warehouse = await WarehouseService.getById(id);
      if (!warehouse) {
        return res.status(404).json({ error: "Almacén no encontrado" });
      }
      return res.json(warehouse);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el almacén" });
    }
  }

  static async createWarehouse(req: Request, res: Response) {
    try {
      const newWarehouse = await WarehouseService.create(req.body);
      return res.status(201).json(newWarehouse);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al crear el almacén (verifique que el nombre no esté duplicado)",
        details: error.message 
      });
    }
  }

  static async updateWarehouse(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updatedWarehouse = await WarehouseService.update(id, req.body);
      return res.json(updatedWarehouse);
    } catch (error) {
      return res.status(400).json({ error: "Error al actualizar el almacén" });
    }
  }

  static async deleteWarehouse(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await WarehouseService.delete(id);
      return res.json({ message: "Almacén eliminado correctamente" });
    } catch (error: any) {
      return res.status(400).json({ error: "No se puede eliminar el almacén porque tiene stock o movimientos asociados" });
    }
  }
}