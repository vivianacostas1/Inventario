"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierController = void 0;
const suppliers_service_1 = require("../services/suppliers.service");
class SupplierController {
    static async getSuppliers(req, res) {
        try {
            const suppliers = await suppliers_service_1.SupplierService.getAll();
            return res.json(suppliers);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los proveedores" });
        }
    }
    static async getSupplierById(req, res) {
        try {
            const id = String(req.params.id);
            const supplier = await suppliers_service_1.SupplierService.getById(id);
            if (!supplier) {
                return res.status(404).json({ error: "Proveedor no encontrado" });
            }
            return res.json(supplier);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el proveedor" });
        }
    }
    static async createSupplier(req, res) {
        try {
            const newSupplier = await suppliers_service_1.SupplierService.create(req.body);
            return res.status(201).json(newSupplier);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al crear el proveedor (verifique el correo o datos)" });
        }
    }
    static async updateSupplier(req, res) {
        try {
            const id = String(req.params.id);
            const updatedSupplier = await suppliers_service_1.SupplierService.update(id, req.body);
            return res.json(updatedSupplier);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el proveedor" });
        }
    }
    static async deleteSupplier(req, res) {
        try {
            const id = String(req.params.id);
            await suppliers_service_1.SupplierService.delete(id);
            return res.json({ message: "Proveedor desactivado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: "Error al eliminar el proveedor" });
        }
    }
}
exports.SupplierController = SupplierController;
