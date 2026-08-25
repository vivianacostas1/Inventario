"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const prisma_1 = require("../config/prisma");
class PurchaseService {
    static async getAll() {
        return await prisma_1.prisma.purchase.findMany({
            include: {
                supplier: true,
                user: true,
                shareholder: true,
                items: { include: { product: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.purchase.findUnique({
            where: { id },
            include: {
                supplier: true,
                user: true,
                shareholder: true,
                items: { include: { product: true } },
            },
        });
    }
    static async create(data) {
        const { supplierId, userId, shareholderId, items } = data;
        let totalAmount = 0;
        const formattedItems = items.map((item) => {
            const subtotal = item.quantity * item.unitCost;
            totalAmount += subtotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                unitCost: item.unitCost,
                subtotal,
            };
        });
        return await prisma_1.prisma.$transaction(async (tx) => {
            return await tx.purchase.create({
                data: {
                    supplierId,
                    userId,
                    shareholderId: shareholderId || null,
                    totalAmount,
                    status: "PENDING",
                    items: { create: formattedItems },
                },
                include: { items: true },
            });
        });
    }
    static async updateStatus(id, status, warehouseId) {
        return await prisma_1.prisma.$transaction(async (tx) => {
            const purchase = await tx.purchase.findUnique({
                where: { id },
                include: { items: true }, // El shareholderId viene incluido por defecto en purchase
            });
            if (!purchase)
                throw new Error("Compra no encontrada");
            // --- PROTECCIÓN: Evitar cambios en compras ya recibidas ---
            if (purchase.status === "RECEIVED" && status !== "RECEIVED") {
                throw new Error("No puedes modificar el estado de una compra que ya ha sido recibida.");
            }
            // ---------------------------------------------------------
            const updateData = { status };
            if (status === "RECEIVED" && purchase.status !== "RECEIVED") {
                updateData.receivedAt = new Date();
                let targetWarehouseId = warehouseId;
                if (!targetWarehouseId) {
                    const defaultWarehouse = await tx.warehouse.findFirst();
                    if (!defaultWarehouse)
                        throw new Error("No hay almacenes configurados.");
                    targetWarehouseId = defaultWarehouse.id;
                }
                for (const item of purchase.items) {
                    // A. Actualizar Stock
                    await tx.stock.upsert({
                        where: { productId_warehouseId: { productId: item.productId, warehouseId: targetWarehouseId } },
                        update: { quantity: { increment: item.quantity } },
                        create: { productId: item.productId, warehouseId: targetWarehouseId, quantity: item.quantity },
                    });
                    // B. Historial
                    await tx.stockMovement.create({
                        data: {
                            productId: item.productId,
                            warehouseId: targetWarehouseId,
                            userId: purchase.userId,
                            type: "IN",
                            quantity: item.quantity,
                            reason: `Recepción de Compra ID: ${purchase.id}`,
                        },
                    });
                    // C. Asignación al Accionista
                    if (purchase.shareholderId) {
                        await tx.shareholderProduct.upsert({
                            where: {
                                shareholderId_productId: {
                                    shareholderId: purchase.shareholderId,
                                    productId: item.productId,
                                },
                            },
                            update: { quantity: { increment: item.quantity } },
                            create: {
                                shareholderId: purchase.shareholderId,
                                productId: item.productId,
                                quantity: item.quantity,
                            },
                        });
                    }
                }
            }
            return await tx.purchase.update({
                where: { id },
                data: updateData,
                include: {
                    supplier: true,
                    user: true,
                    shareholder: true,
                    items: { include: { product: true } },
                },
            });
        });
    }
}
exports.PurchaseService = PurchaseService;
