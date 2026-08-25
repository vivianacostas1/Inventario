"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleController = void 0;
const sales_service_1 = require("../services/sales.service");
class SaleController {
    static async getSales(req, res) {
        try {
            const sales = await sales_service_1.SaleService.getAll();
            return res.json(sales);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener las ventas" });
        }
    }
    static async getSaleById(req, res) {
        try {
            const id = String(req.params.id);
            const sale = await sales_service_1.SaleService.getById(id);
            if (!sale) {
                return res.status(404).json({ error: "Venta no encontrada" });
            }
            return res.json(sale);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener la venta" });
        }
    }
    static async createSale(req, res) {
        try {
            // Tomamos el userId del req.user (corregido a .userId para que coincida con el middleware)
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Usuario no autenticado o token inválido" });
            }
            // Combinamos el body con el userId obtenido del token
            const saleData = { ...req.body, userId };
            const newSale = await sales_service_1.SaleService.create(saleData);
            return res.status(201).json(newSale);
        }
        catch (error) {
            return res.status(400).json({
                error: "Error al registrar la venta",
                details: error.message
            });
        }
    }
    static async updateStatus(req, res) {
        try {
            const id = String(req.params.id);
            const { status } = req.body;
            const updatedSale = await sales_service_1.SaleService.updateStatus(id, status);
            return res.json(updatedSale);
        }
        catch (error) {
            return res.status(400).json({ error: error.message || "Error al actualizar el estado de la venta" });
        }
    }
}
exports.SaleController = SaleController;
