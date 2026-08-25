"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockMovementService = void 0;
const prisma_1 = require("../config/prisma");
class StockMovementService {
    static async getAll() {
        return await prisma_1.prisma.stockMovement.findMany({
            include: {
                warehouse: true,
                product: true,
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.stockMovement.findUnique({
            where: { id },
            include: {
                warehouse: true,
                product: true,
                user: true,
            },
        });
    }
    static async create(data) {
        return await prisma_1.prisma.$transaction(async (tx) => {
            // 1. Crear el registro usando el DTO directamente casteado
            const movement = await tx.stockMovement.create({
                data: data,
                include: {
                    warehouse: true,
                    product: true,
                    user: true,
                },
            });
            // 2. Buscar o calcular el stock actual en ese almacén
            const currentStock = await tx.stock.findUnique({
                where: {
                    productId_warehouseId: {
                        productId: data.productId,
                        warehouseId: data.warehouseId,
                    },
                },
            });
            // Si es IN suma, de lo contrario resta (como OUT)
            const qtyChange = data.type === "IN" ? data.quantity : -data.quantity;
            const newQuantity = (currentStock ? currentStock.quantity : 0) + qtyChange;
            // 3. Actualizar o crear el registro de stock resultante
            await tx.stock.upsert({
                where: {
                    productId_warehouseId: {
                        productId: data.productId,
                        warehouseId: data.warehouseId,
                    },
                },
                update: { quantity: newQuantity },
                create: {
                    productId: data.productId,
                    warehouseId: data.warehouseId,
                    quantity: Math.max(0, newQuantity),
                },
            });
            return movement;
        });
    }
}
exports.StockMovementService = StockMovementService;
