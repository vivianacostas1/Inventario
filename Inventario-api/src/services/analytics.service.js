"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
class AnalyticsService {
    // 1. Resumen General
    static async getGeneralSummary() {
        const completedSales = await prisma_1.prisma.sale.findMany({
            where: { status: client_1.SaleStatus.COMPLETED },
            include: { items: { include: { product: true } } }
        });
        let totalRevenue = 0;
        let totalCost = 0;
        completedSales.forEach(sale => {
            totalRevenue += Number(sale.totalAmount);
            sale.items.forEach(item => {
                const costPrice = Number(item.product.costPrice);
                totalCost += costPrice * item.quantity;
            });
        });
        const grossProfit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
        const stocks = await prisma_1.prisma.stock.findMany({ include: { product: true } });
        let totalInventoryValue = 0;
        stocks.forEach(s => {
            totalInventoryValue += s.quantity * Number(s.product.costPrice);
        });
        return {
            totalRevenue,
            totalCost,
            grossProfit,
            profitMargin: Number(profitMargin.toFixed(2)),
            totalInventoryValue
        };
    }
    // 2. Top Productos más vendidos
    static async getTopSellingProducts() {
        const topItems = await prisma_1.prisma.saleItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true, subtotal: true },
            orderBy: { _sum: { subtotal: 'desc' } },
            take: 5
        });
        const result = await Promise.all(topItems.map(async (item) => {
            const product = await prisma_1.prisma.product.findUnique({ where: { id: item.productId } });
            return {
                productId: item.productId,
                productName: product?.name || 'Desconocido',
                totalQuantitySold: item._sum.quantity || 0,
                totalRevenue: Number(item._sum.subtotal || 0),
            };
        }));
        return result;
    }
    // 3. Ventas por Mes (Para gráfico de barras)
    static async getSalesPerMonth() {
        const completedSales = await prisma_1.prisma.sale.findMany({
            where: { status: client_1.SaleStatus.COMPLETED },
            select: { createdAt: true, totalAmount: true }
        });
        const monthlyData = {};
        completedSales.forEach(sale => {
            const date = new Date(sale.createdAt);
            const monthYear = `${date.toLocaleString('es', { month: 'short' })} ${date.getFullYear()}`;
            monthlyData[monthYear] = (monthlyData[monthYear] || 0) + Number(sale.totalAmount);
        });
        return Object.keys(monthlyData).map(month => ({
            month,
            total: monthlyData[month]
        }));
    }
    // 4. Análisis Avanzado de Compras y Movimiento (Qué NO comprar / Movimiento Lento)
    static async getAdvancedInsights() {
        const products = await prisma_1.prisma.product.findMany({
            include: {
                stocks: true,
                saleItems: {
                    include: { sale: true }
                }
            }
        });
        const insights = products.map(product => {
            const totalStock = product.stocks.reduce((acc, s) => acc + s.quantity, 0);
            const totalSold = product.saleItems.reduce((acc, item) => acc + item.quantity, 0);
            // Criterio de "Movimiento Lento": Mucho stock acumulado y 0 o muy pocas ventas
            const isSlowMoving = totalStock > 5 && totalSold === 0;
            // Criterio "No Comprar": Stock alto y baja rotación
            const shouldNotBuy = totalStock >= (product.maxStock || 20) || (totalStock > 10 && totalSold === 0);
            return {
                productId: product.id,
                productName: product.name,
                totalStock,
                totalSold,
                isSlowMoving,
                shouldNotBuy,
                recommendation: shouldNotBuy
                    ? `Evitar comprar: Stock elevado (${totalStock} un.) y baja salida.`
                    : isSlowMoving
                        ? `Lento en almacén: Sin rotación reciente.`
                        : `Rotación saludable.`
            };
        });
        return insights;
    }
    // 5. Alertas de Inventario
    static async getInventoryAlerts() {
        const stocks = await prisma_1.prisma.stock.findMany({
            include: { product: true, warehouse: true }
        });
        const alerts = stocks
            .filter(item => item.quantity <= item.product.minStock)
            .map(item => ({
            id: item.id,
            productId: item.productId,
            warehouseId: item.warehouseId,
            needsReorder: true,
            product: item.product,
            currentStock: item.quantity,
            message: `El producto "${item.product.name}" tiene un stock crítico de ${item.quantity} unidades (Mínimo: ${item.product.minStock}).`
        }));
        return alerts;
    }
}
exports.AnalyticsService = AnalyticsService;
