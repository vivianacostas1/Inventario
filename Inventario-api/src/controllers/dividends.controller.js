"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DividendController = void 0;
const dividends_service_1 = require("../services/dividends.service");
class DividendController {
    static async getDividends(req, res) {
        try {
            const dividends = await dividends_service_1.DividendService.getAll();
            return res.json(dividends);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los dividendos" });
        }
    }
    static async getDividendById(req, res) {
        try {
            const id = String(req.params.id);
            const dividend = await dividends_service_1.DividendService.getById(id);
            if (!dividend) {
                return res.status(404).json({ error: "Dividendo no encontrado" });
            }
            return res.json(dividend);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener el dividendo" });
        }
    }
    static async createDividend(req, res) {
        try {
            const newDividend = await dividends_service_1.DividendService.create(req.body);
            return res.status(201).json(newDividend);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al registrar el dividendo (verifique que el accionista y el producto existan)",
                details: error.message
            });
        }
    }
    static async updateDividend(req, res) {
        try {
            const id = String(req.params.id);
            const updatedDividend = await dividends_service_1.DividendService.update(id, req.body);
            return res.json(updatedDividend);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el dividendo" });
        }
    }
    static async deleteDividend(req, res) {
        try {
            const id = String(req.params.id);
            await dividends_service_1.DividendService.delete(id);
            return res.json({ message: "Dividendo eliminado correctamente" });
        }
        catch (error) {
            return res.status(500).json({ error: "Error al eliminar el dividendo" });
        }
    }
}
exports.DividendController = DividendController;
