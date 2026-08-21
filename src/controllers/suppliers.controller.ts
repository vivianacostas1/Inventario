import { Request, Response } from "express";
import { SupplierService } from "../services/suppliers.service";

export class SupplierController {
  static async getSuppliers(req: Request, res: Response) {
    try {
      const suppliers = await SupplierService.getAll();
      return res.json(suppliers);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los proveedores" });
    }
  }

  static async getSupplierById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const supplier = await SupplierService.getById(id);
      if (!supplier) {
        return res.status(404).json({ error: "Proveedor no encontrado" });
      }
      return res.json(supplier);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el proveedor" });
    }
  }

  static async createSupplier(req: Request, res: Response) {
    try {
      const newSupplier = await SupplierService.create(req.body);
      return res.status(201).json(newSupplier);
    } catch (error) {
      return res.status(400).json({ error: "Error al crear el proveedor (verifique el correo o datos)" });
    }
  }

  static async updateSupplier(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updatedSupplier = await SupplierService.update(id, req.body);
      return res.json(updatedSupplier);
    } catch (error) {
      return res.status(400).json({ error: "Error al actualizar el proveedor" });
    }
  }

  static async deleteSupplier(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await SupplierService.delete(id);
      return res.json({ message: "Proveedor desactivado correctamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el proveedor" });
    }
  }
}