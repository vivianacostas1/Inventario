"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analytics_service_1 = require("../services/analytics.service");
class AnalyticsController {
    static async getDashboardData(req, res) {
        try {
            const summary = await analytics_service_1.AnalyticsService.getGeneralSummary();
            const topProducts = await analytics_service_1.AnalyticsService.getTopSellingProducts();
            const salesPerMonth = await analytics_service_1.AnalyticsService.getSalesPerMonth();
            const advancedInsights = await analytics_service_1.AnalyticsService.getAdvancedInsights();
            const alerts = await analytics_service_1.AnalyticsService.getInventoryAlerts();
            res.json({
                summary,
                topProducts,
                salesPerMonth,
                advancedInsights,
                alerts
            });
        }
        catch (error) {
            console.error("Error en analíticas:", error);
            res.status(500).json({ error: "Error al obtener datos de análisis" });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
