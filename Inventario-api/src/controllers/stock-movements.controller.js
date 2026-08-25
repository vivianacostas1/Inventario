"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementController = void 0;
const stock_movements_service_1 = require("../services/stock-movements.service");
class StockMovementController {
    static async getMovements(req, res) {
        try {
            const movements = await stock_movements_service_1.StockMovementService.getAll();
            return res.json(movements);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los movimientos de stock" });
        }
    }
    static async getMovementById(req, res) {
        try {
            const id = String(req.params.id);
            const movement = await stock_movements_service_1.StockMovementService.getById(id);
            if (!movement) {
                return res.status(404).json({ error: "Movimiento de stock no encontrado" });
            }
            return res.json(movement);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el movimiento de stock" });
        }
    }
    static async createMovement(req, res) {
        try {
            const newMovement = await stock_movements_service_1.StockMovementService.create(req.body);
            return res.status(201).json(newMovement);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al registrar el movimiento de stock (verifique IDs de almacén, producto y usuario)",
                details: error.message
            });
        }
    }
}
exports.StockMovementController = StockMovementController;
