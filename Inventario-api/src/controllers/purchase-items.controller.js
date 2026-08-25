"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseItemController = void 0;
const purchase_items_service_1 = require("../services/purchase-items.service");
class PurchaseItemController {
    static async getItemsByPurchase(req, res) {
        try {
            const { purchaseId } = req.params;
            const items = await purchase_items_service_1.PurchaseItemService.getByPurchaseId(String(purchaseId));
            return res.json(items);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los ítems de la compra" });
        }
    }
    static async createItem(req, res) {
        try {
            const newItem = await purchase_items_service_1.PurchaseItemService.create(req.body);
            return res.status(201).json(newItem);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al registrar el ítem de compra",
                details: error.message
            });
        }
    }
}
exports.PurchaseItemController = PurchaseItemController;
