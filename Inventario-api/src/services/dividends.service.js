"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DividendService = void 0;
const prisma_1 = require("../config/prisma");
class DividendService {
    static async getAll() {
        return await prisma_1.prisma.dividend.findMany({
            include: {
                shareholder: true,
                product: true,
            },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.dividend.findUnique({
            where: { id },
            include: {
                shareholder: true,
                product: true,
            },
        });
    }
    static async create(data) {
        return await prisma_1.prisma.dividend.create({
            data: data,
            include: {
                shareholder: true,
                product: true,
            },
        });
    }
    static async update(id, data) {
        return await prisma_1.prisma.dividend.update({
            where: { id },
            data: data,
            include: {
                shareholder: true,
                product: true,
            },
        });
    }
    static async delete(id) {
        return await prisma_1.prisma.dividend.delete({
            where: { id },
        });
    }
}
exports.DividendService = DividendService;
