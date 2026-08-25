"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleService = void 0;
const prisma_1 = require("../config/prisma");
const client_1 = require("@prisma/client");
class SaleService {
    static async getAll() {
        return await prisma_1.prisma.sale.findMany({
            include: {
                customer: true,
                user: true,
                items: {
                    include: {
                        product: true,
                        shareholder: true,
                    },
                },
            },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.sale.findUnique({
            where: { id },
            include: {
                customer: true,
                user: true,
                items: {
                    include: {
                        product: true,
                        shareholder: true,
                    },
                },
            },
        });
    }
    static async create(data) {
        const { customerId, userId, warehouseId, items } = data;
        let totalAmount = 0;
        const formattedItems = [];
        // Validaciones iniciales de productos y precios
        for (const item of items) {
            const product = await prisma_1.prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new Error(`Producto con ID ${item.productId} no encontrado`);
            }
            // Lógica: Usa el unitPrice enviado desde el frontend si existe, sino usa el precio del producto
            const unitPrice = item.unitPrice !== undefined && item.unitPrice !== null && !isNaN(Number(item.unitPrice))
                ? Number(item.unitPrice)
                : Number(product.unitPrice);
            // 🛑 Validación estricta en el backend: Evitar precio menor al costo
            const costPrice = Number(product.costPrice || 0);
            if (unitPrice < costPrice) {
                throw new Error(`El precio de venta para "${product.name}" no puede ser menor al precio de costo (Bs ${costPrice.toFixed(2)})`);
            }
            const subtotal = item.quantity * unitPrice;
            totalAmount += subtotal;
            formattedItems.push({
                productId: item.productId,
                shareholderId: item.shareholderId || null,
                quantity: item.quantity,
                unitPrice: unitPrice,
                subtotal,
            });
        }
        return await prisma_1.prisma.$transaction(async (tx) => {
            // 1. Validar y descontar stock
            for (const item of items) {
                const stockRecord = await tx.stock.findUnique({
                    where: {
                        productId_warehouseId: {
                            productId: item.productId,
                            warehouseId: warehouseId,
                        },
                    },
                });
                if (!stockRecord || stockRecord.quantity < item.quantity) {
                    throw new Error(`Stock insuficiente en el almacén para el producto ID: ${item.productId}`);
                }
                if (item.shareholderId) {
                    const shareholderProduct = await tx.shareholderProduct.findUnique({
                        where: {
                            shareholderId_productId: {
                                shareholderId: item.shareholderId,
                                productId: item.productId,
                            },
                        },
                    });
                    if (!shareholderProduct || shareholderProduct.quantity < item.quantity) {
                        throw new Error(`Stock insuficiente del accionista para el producto ID: ${item.productId}`);
                    }
                    await tx.shareholderProduct.update({
                        where: { id: shareholderProduct.id },
                        data: { quantity: { decrement: item.quantity } },
                    });
                }
                await tx.stock.update({
                    where: {
                        productId_warehouseId: {
                            productId: item.productId,
                            warehouseId: warehouseId,
                        },
                    },
                    data: { quantity: { decrement: item.quantity } },
                });
            }
            // 2. Crear la venta y sus ítems
            const sale = await tx.sale.create({
                data: {
                    customerId: customerId || null,
                    userId,
                    totalAmount,
                    status: client_1.SaleStatus.COMPLETED,
                    items: {
                        create: formattedItems,
                    },
                },
                include: {
                    customer: true,
                    user: true,
                    items: {
                        include: {
                            product: true,
                            shareholder: true
                        },
                    },
                },
            });
            // 3. Registrar movimientos de inventario
            for (const item of items) {
                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        warehouseId: warehouseId,
                        userId: userId,
                        type: client_1.MovementType.OUT,
                        quantity: item.quantity,
                        reason: `Venta realizada (Ref: ${sale.id})`,
                        referenceId: sale.id,
                    },
                });
            }
            return sale;
        });
    }
    static async updateStatus(id, status) {
        const sale = await prisma_1.prisma.sale.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!sale) {
            throw new Error("Venta no encontrada");
        }
        return await prisma_1.prisma.sale.update({
            where: { id },
            data: { status },
            include: {
                customer: true,
                user: true,
                items: {
                    include: {
                        product: true,
                        shareholder: true
                    }
                },
            },
        });
    }
}
exports.SaleService = SaleService;
