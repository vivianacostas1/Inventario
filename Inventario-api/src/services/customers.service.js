"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const prisma_1 = require("../config/prisma");
class CustomerService {
    static async getAll() {
        return await prisma_1.prisma.customer.findMany({
            include: {
                sales: true, // Incluye el historial de ventas asociadas al cliente
            },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.customer.findUnique({
            where: { id },
            include: {
                sales: true,
            },
        });
    }
    static async create(data) {
        return await prisma_1.prisma.customer.create({
            data,
        });
    }
    static async update(id, data) {
        return await prisma_1.prisma.customer.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return await prisma_1.prisma.customer.delete({
            where: { id },
        });
    }
}
exports.CustomerService = CustomerService;
