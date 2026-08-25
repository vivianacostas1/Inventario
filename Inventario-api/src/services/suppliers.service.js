"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierService = void 0;
const prisma_1 = require("../config/prisma");
class SupplierService {
    static async getAll() {
        return await prisma_1.prisma.supplier.findMany({
            where: { isActive: true },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.supplier.findUnique({
            where: { id },
        });
    }
    static async create(data) {
        return await prisma_1.prisma.supplier.create({
            data,
        });
    }
    static async update(id, data) {
        return await prisma_1.prisma.supplier.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        // Baja lógica basada en tu campo 'isActive' (@map("esta_activo"))
        return await prisma_1.prisma.supplier.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
exports.SupplierService = SupplierService;
