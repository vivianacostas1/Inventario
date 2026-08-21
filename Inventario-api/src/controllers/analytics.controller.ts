import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  static async getDashboardData(req: Request, res: Response) {
    try {
      const summary = await AnalyticsService.getGeneralSummary();
      const topProducts = await AnalyticsService.getTopSellingProducts();
      const salesPerMonth = await AnalyticsService.getSalesPerMonth();
      const advancedInsights = await AnalyticsService.getAdvancedInsights();
      const alerts = await AnalyticsService.getInventoryAlerts();

      res.json({
        summary,
        topProducts,
        salesPerMonth,
        advancedInsights,
        alerts
      });
    } catch (error) {
      console.error("Error en analíticas:", error);
      res.status(500).json({ error: "Error al obtener datos de análisis" });
    }
  }
}