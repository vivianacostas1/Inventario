"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const stocks_service_1 = require("../services/stocks.service");
class StockController {
    static async getStock(req, res) {
        try {
            const stock = await stocks_service_1.StockService.getAllStock();
            return res.json(stock);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el stock" });
        }
    }
    static async upsertStock(req, res) {
        try {
            const stock = await stocks_service_1.StockService.upsertStock(req.body);
            return res.status(201).json(stock);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el stock", details: error.message });
        }
    }
    static async getMovements(req, res) {
        try {
            const movements = await stocks_service_1.StockService.getAllMovements();
            return res.json(movements);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los movimientos de stock" });
        }
    }
    static async createMovement(req, res) {
        try {
            const movement = await stocks_service_1.StockService.createMovement(req.body);
            return res.status(201).json(movement);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al registrar el movimiento de stock", details: error.message });
        }
    }
}
exports.StockController = StockController;
