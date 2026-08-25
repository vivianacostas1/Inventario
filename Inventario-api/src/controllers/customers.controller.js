"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customers_service_1 = require("../services/customers.service");
class CustomerController {
    static async getCustomers(req, res) {
        try {
            const customers = await customers_service_1.CustomerService.getAll();
            return res.json(customers);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los clientes" });
        }
    }
    static async getCustomerById(req, res) {
        try {
            const id = String(req.params.id);
            const customer = await customers_service_1.CustomerService.getById(id);
            if (!customer) {
                return res.status(404).json({ error: "Cliente no encontrado" });
            }
            return res.json(customer);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el cliente" });
        }
    }
    static async createCustomer(req, res) {
        try {
            const newCustomer = await customers_service_1.CustomerService.create(req.body);
            return res.status(201).json(newCustomer);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al crear el cliente (verifique que el correo no esté duplicado)",
                details: error.message
            });
        }
    }
    static async updateCustomer(req, res) {
        try {
            const id = String(req.params.id);
            const updatedCustomer = await customers_service_1.CustomerService.update(id, req.body);
            return res.json(updatedCustomer);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el cliente" });
        }
    }
    static async deleteCustomer(req, res) {
        try {
            const id = String(req.params.id);
            await customers_service_1.CustomerService.delete(id);
            return res.json({ message: "Cliente eliminado correctamente" });
        }
        catch (error) {
            return res.status(400).json({ error: "Error al eliminar el cliente" });
        }
    }
}
exports.CustomerController = CustomerController;
