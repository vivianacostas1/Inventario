"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const prisma_1 = require("../config/prisma");
class ProductService {
    static async getAll() {
        const count = await prisma_1.prisma.product.count({
            where: { isActive: true },
        });
        if (count === 0) {
            return [];
        }
        return await prisma_1.prisma.product.findMany({
            where: { isActive: true },
            include: {
                category: true,
                supplier: true,
                shareholderProducts: {
                    include: {
                        shareholder: true,
                    },
                },
            },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                supplier: true,
                stocks: {
                    include: {
                        warehouse: true,
                    },
                },
                shareholderProducts: {
                    include: {
                        shareholder: true,
                    },
                },
            },
        });
    }
    static async update(id, data) {
        const { shareholders, ...productData } = data;
        if (shareholders) {
            await prisma_1.prisma.shareholderProduct.deleteMany({
                where: { productId: id },
            });
        }
        return await prisma_1.prisma.product.update({
            where: { id },
            data: {
                ...productData,
                shareholderProducts: shareholders ? {
                    create: shareholders.map((shareholderId) => ({
                        shareholder: { connect: { id: shareholderId } }
                    }))
                } : undefined,
            },
            include: {
                category: true,
                supplier: true,
                shareholderProducts: { include: { shareholder: true } },
            },
        });
    }
    static async delete(id) {
        return await prisma_1.prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    }
    // Función auxiliar para generar el SKU automáticamente (ej. PROD1, PROD2...)
    static async generateNextSku() {
        const lastProduct = await prisma_1.prisma.product.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { sku: true },
        });
        if (!lastProduct || !lastProduct.sku) {
            return 'PROD1';
        }
        const match = lastProduct.sku.match(/\d+$/);
        if (!match) {
            return 'PROD1';
        }
        const nextNumber = parseInt(match[0], 10) + 1;
        return `PROD${nextNumber}`;
    }
    // Única función create limpia
    static async create(data) {
        const { shareholders, ...productData } = data;
        const generatedSku = await ProductService.generateNextSku();
        return await prisma_1.prisma.product.create({
            data: {
                ...productData,
                sku: generatedSku,
                shareholderProducts: shareholders && shareholders.length > 0 ? {
                    create: shareholders.map((shareholderId) => ({
                        shareholder: { connect: { id: shareholderId } }
                    }))
                } : undefined,
            },
            include: {
                category: true,
                supplier: true,
                shareholderProducts: { include: { shareholder: true } },
            },
        });
    }
    // Agrega esto a tu clase ProductService
    static async getNextSku() {
        return await this.generateNextSku();
    }
}
exports.ProductService = ProductService;
