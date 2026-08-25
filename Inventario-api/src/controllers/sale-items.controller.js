"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleItemController = void 0;
const sale_items_service_1 = require("../services/sale-items.service");
class SaleItemController {
    static async getItemsBySale(req, res) {
        try {
            const saleId = String(req.params.saleId);
            const items = await sale_items_service_1.SaleItemService.getBySaleId(saleId);
            return res.json(items);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los ítems de la venta" });
        }
    }
    static async createItem(req, res) {
        try {
            const newItem = await sale_items_service_1.SaleItemService.create(req.body);
            return res.status(201).json(newItem);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al registrar el ítem de venta",
                details: error.message
            });
        }
    }
}
exports.SaleItemController = SaleItemController;
