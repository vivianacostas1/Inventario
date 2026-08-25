"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleItemService = void 0;
const prisma_1 = require("../config/prisma");
class SaleItemService {
    static async getBySaleId(saleId) {
        return await prisma_1.prisma.saleItem.findMany({
            where: { saleId },
            include: {
                product: true,
            },
        });
    }
    static async create(data) {
        const subtotal = Number(data.quantity) * Number(data.unitPrice);
        return await prisma_1.prisma.$transaction(async (tx) => {
            // 1. Crear el ítem de venta usando data as any para evitar conflictos de tipos
            const saleItem = await tx.saleItem.create({
                data: {
                    saleId: data.saleId,
                    productId: data.productId,
                    quantity: data.quantity,
                    unitPrice: data.unitPrice ?? 0,
                    subtotal,
                    shareholderId: data.shareholderId,
                    shareholderProductId: data.shareholderProductId,
                },
                include: {
                    product: true,
                },
            });
            // 2. Recalcular y actualizar el monto total en la tabla de ventas principal
            const allItems = await tx.saleItem.findMany({
                where: { saleId: data.saleId },
            });
            const totalAmount = allItems.reduce((acc, item) => acc + Number(item.subtotal), 0);
            await tx.sale.update({
                where: { id: data.saleId },
                data: { totalAmount },
            });
            return saleItem;
        });
    }
}
exports.SaleItemService = SaleItemService;
