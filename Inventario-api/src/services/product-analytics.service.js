"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductAnalyticsService = void 0;
const prisma_1 = require("../config/prisma");
class ProductAnalyticsService {
    // Obtener el análisis de todos los productos
    static async getAll() {
        return await prisma_1.prisma.productAnalytics.findMany({
            include: {
                product: true,
            },
        });
    }
    // Obtener el análisis de un producto específico por su ID de producto
    static async getByProductId(productId) {
        const analytics = await prisma_1.prisma.productAnalytics.findUnique({
            where: { productId },
            include: {
                product: true,
            },
        });
        if (!analytics) {
            throw new Error("No se encontró análisis para este producto");
        }
        return analytics;
    }
    // Actualizar o recalcular las métricas del producto
    static async update(productId, data) {
        return await prisma_1.prisma.productAnalytics.upsert({
            where: { productId },
            update: data,
            create: {
                productId,
                currentStock: data.currentStock ?? 0,
                avgMonthlySales: data.avgMonthlySales ?? 0,
                daysWithoutMovement: data.daysWithoutMovement ?? 0,
                reorderPoint: data.reorderPoint ?? 0,
                suggestedReorderQty: data.suggestedReorderQty ?? 0,
                isSlowMoving: data.isSlowMoving ?? false,
                needsReorder: data.needsReorder ?? false,
            },
            include: {
                product: true,
            },
        });
    }
}
exports.ProductAnalyticsService = ProductAnalyticsService;
