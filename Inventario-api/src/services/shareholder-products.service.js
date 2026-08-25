"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShareholderProductService = void 0;
const prisma_1 = require("../config/prisma");
class ShareholderProductService {
    // Listar todas las relaciones existentes
    static async getAll() {
        return await prisma_1.prisma.shareholderProduct.findMany({
            include: {
                shareholder: true,
                product: true,
            },
        });
    }
    // Asignar y sumar la cantidad de un producto a un accionista
    static async assignProduct(data) {
        const quantityToAdd = data.quantity ?? 0;
        return await prisma_1.prisma.shareholderProduct.upsert({
            where: {
                shareholderId_productId: {
                    shareholderId: data.shareholderId,
                    productId: data.productId,
                },
            },
            update: {
                // Incrementa (suma) la cantidad nueva a la que ya existía en la base de datos
                quantity: {
                    increment: quantityToAdd,
                },
            },
            create: {
                shareholderId: data.shareholderId,
                productId: data.productId,
                quantity: quantityToAdd,
            },
            include: {
                shareholder: true,
                product: true,
            },
        });
    }
    // Eliminar una asignación específica por el ID de la relación
    static async removeAssignment(id) {
        return await prisma_1.prisma.shareholderProduct.delete({
            where: { id },
        });
    }
}
exports.ShareholderProductService = ShareholderProductService;
