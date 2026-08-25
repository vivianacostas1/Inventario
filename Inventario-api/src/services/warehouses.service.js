"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseService = void 0;
const prisma_1 = require("../config/prisma");
class WarehouseService {
    static async getAll() {
        return await prisma_1.prisma.warehouse.findMany({
            include: {
                stocks: {
                    include: {
                        product: true, // Muestra los productos y cantidades que hay en este almacén
                    },
                },
            },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.warehouse.findUnique({
            where: { id },
            include: {
                stocks: {
                    include: {
                        product: true,
                    },
                },
                stockMovements: true, // Historial de movimientos en este almacén
            },
        });
    }
    static async create(data) {
        return await prisma_1.prisma.warehouse.create({
            data,
        });
    }
    static async update(id, data) {
        return await prisma_1.prisma.warehouse.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return await prisma_1.prisma.warehouse.delete({
            where: { id },
        });
    }
}
exports.WarehouseService = WarehouseService;
