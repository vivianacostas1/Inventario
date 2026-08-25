"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
const warehouses_service_1 = require("../services/warehouses.service");
class WarehouseController {
    static async getWarehouses(req, res) {
        try {
            const warehouses = await warehouses_service_1.WarehouseService.getAll();
            return res.json(warehouses);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los almacenes" });
        }
    }
    static async getWarehouseById(req, res) {
        try {
            const id = String(req.params.id);
            const warehouse = await warehouses_service_1.WarehouseService.getById(id);
            if (!warehouse) {
                return res.status(404).json({ error: "Almacén no encontrado" });
            }
            return res.json(warehouse);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el almacén" });
        }
    }
    static async createWarehouse(req, res) {
        try {
            const newWarehouse = await warehouses_service_1.WarehouseService.create(req.body);
            return res.status(201).json(newWarehouse);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al crear el almacén (verifique que el nombre no esté duplicado)",
                details: error.message
            });
        }
    }
    static async updateWarehouse(req, res) {
        try {
            const id = String(req.params.id);
            const updatedWarehouse = await warehouses_service_1.WarehouseService.update(id, req.body);
            return res.json(updatedWarehouse);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el almacén" });
        }
    }
    static async deleteWarehouse(req, res) {
        try {
            const id = String(req.params.id);
            await warehouses_service_1.WarehouseService.delete(id);
            return res.json({ message: "Almacén eliminado correctamente" });
        }
        catch (error) {
            return res.status(400).json({ error: "No se puede eliminar el almacén porque tiene stock o movimientos asociados" });
        }
    }
}
exports.WarehouseController = WarehouseController;
