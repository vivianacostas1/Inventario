"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAnalyticsController = void 0;
const product_analytics_service_1 = require("../services/product-analytics.service");
class ProductAnalyticsController {
    static async getAllAnalytics(req, res) {
        try {
            const analytics = await product_analytics_service_1.ProductAnalyticsService.getAll();
            return res.json(analytics);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al obtener los análisis de productos" });
        }
    }
    static async getAnalyticsByProduct(req, res) {
        try {
            const productId = String(req.params.productId);
            const analytics = await product_analytics_service_1.ProductAnalyticsService.getByProductId(productId);
            return res.json(analytics);
        }
        catch (error) {
            return res.status(404).json({ error: error.message || "Error al obtener el análisis" });
        }
    }
    static async updateAnalytics(req, res) {
        try {
            const productId = String(req.params.productId);
            const updated = await product_analytics_service_1.ProductAnalyticsService.update(productId, req.body);
            return res.json(updated);
        }
        catch (error) {
            return res.status(400).json({ error: "Error al actualizar el análisis", details: error.message });
        }
    }
}
exports.ProductAnalyticsController = ProductAnalyticsController;
