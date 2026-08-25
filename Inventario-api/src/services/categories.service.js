"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const prisma_1 = require("../config/prisma");
class CategoryService {
    static async getAll() {
        return await prisma_1.prisma.category.findMany();
    }
    static async getById(id) {
        return await prisma_1.prisma.category.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });
    }
    static async create(data) {
        return await prisma_1.prisma.category.create({
            data,
        });
    }
    static async update(id, data) {
        return await prisma_1.prisma.category.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        return await prisma_1.prisma.category.delete({
            where: { id },
        });
    }
}
exports.CategoryService = CategoryService;
