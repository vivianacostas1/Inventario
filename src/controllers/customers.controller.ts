import { Request, Response } from "express";
import { CustomerService } from "../services/customers.service";

export class CustomerController {
  static async getCustomers(req: Request, res: Response) {
    try {
      const customers = await CustomerService.getAll();
      return res.json(customers);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los clientes" });
    }
  }

  static async getCustomerById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const customer = await CustomerService.getById(id);
      if (!customer) {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }
      return res.json(customer);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el cliente" });
    }
  }

  static async createCustomer(req: Request, res: Response) {
    try {
      const newCustomer = await CustomerService.create(req.body);
      return res.status(201).json(newCustomer);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al crear el cliente (verifique que el correo no esté duplicado)",
        details: error.message 
      });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updatedCustomer = await CustomerService.update(id, req.body);
      return res.json(updatedCustomer);
    } catch (error) {
      return res.status(400).json({ error: "Error al actualizar el cliente" });
    }
  }

  static async deleteCustomer(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await CustomerService.delete(id);
      return res.json({ message: "Cliente eliminado correctamente" });
    } catch (error: any) {
      return res.status(400).json({ error: "Error al eliminar el cliente" });
    }
  }
}