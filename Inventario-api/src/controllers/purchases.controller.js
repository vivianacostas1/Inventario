"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseController = void 0;
const purchases_service_1 = require("../services/purchases.service");
class PurchaseController {
    static async getPurchases(req, res) {
        try {
            const purchases = await purchases_service_1.PurchaseService.getAll();
            return res.json(purchases);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener las compras" });
        }
    }
    static async getPurchaseById(req, res) {
        try {
            const id = String(req.params.id);
            const purchase = await purchases_service_1.PurchaseService.getById(id);
            if (!purchase) {
                return res.status(404).json({ error: "Compra no encontrada" });
            }
            return res.json(purchase);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener la compra" });
        }
    }
    static async createPurchase(req, res) {
        try {
            // Tomamos los datos del body y nos aseguramos de capturar el shareholderId y el userId
            const purchaseData = {
                ...req.body,
                // Si tu sistema usa middleware de autenticación, obtén el ID del usuario de req.user. 
                // Si viene en el body, déjalo como req.body.userId
                userId: req.user?.id || req.body.userId,
                shareholderId: req.body.shareholderId || null,
            };
            const newPurchase = await purchases_service_1.PurchaseService.create(purchaseData);
            return res.status(201).json(newPurchase);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al registrar la compra (verifique IDs de proveedor, usuario y productos válidos)",
                details: error.message
            });
        }
    }
    static async updateStatus(req, res) {
        try {
            const id = String(req.params.id);
            const { status, warehouseId } = req.body; // Opcionalmente podemos recibir warehouseId si se envía
            const updatedPurchase = await purchases_service_1.PurchaseService.updateStatus(id, status, warehouseId);
            return res.json(updatedPurchase);
        }
        catch (error) {
            return res.status(400).json({ error: error.message || "Error al actualizar el estado de la compra" });
        }
    }
}
exports.PurchaseController = PurchaseController;
