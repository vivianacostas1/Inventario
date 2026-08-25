"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseItemService = void 0;
const prisma_1 = require("../config/prisma");
class PurchaseItemService {
    static async getByPurchaseId(purchaseId) {
        return await prisma_1.prisma.purchaseItem.findMany({
            where: { purchaseId },
            include: { product: true },
        });
    }
    static async create(data) {
        const subtotal = Number(data.quantity) * Number(data.unitCost);
        return await prisma_1.prisma.$transaction(async (tx) => {
            const purchaseItem = await tx.purchaseItem.create({
                data: {
                    purchaseId: data.purchaseId,
                    productId: data.productId,
                    quantity: data.quantity,
                    unitCost: data.unitCost,
                    subtotal,
                },
                include: { product: true },
            });
            const allItems = await tx.purchaseItem.findMany({
                where: { purchaseId: data.purchaseId },
            });
            const totalAmount = allItems.reduce((acc, item) => acc + Number(item.subtotal), 0);
            await tx.purchase.update({
                where: { id: data.purchaseId },
                data: { totalAmount },
            });
            return purchaseItem;
        });
    }
}
exports.PurchaseItemService = PurchaseItemService;
