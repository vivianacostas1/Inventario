import { Router } from "express";
import { AnalyticsController } from "../controllers/analytics.controller";

const router = Router();

// GET /api/analytics
router.get("/", AnalyticsController.getDashboardData);

export default router;