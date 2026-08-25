"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const prisma_1 = require("../config/prisma"); // Asegúrate de tener tu instancia de prisma configurada
class UserService {
    static async getAll() {
        return await prisma_1.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
    static async getById(id) {
        return await prisma_1.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true,
            },
        });
    }
    static async create(data) {
        return await prisma_1.prisma.user.create({
            data,
        });
    }
    static async update(id, data) {
        return await prisma_1.prisma.user.update({
            where: { id },
            data,
        });
    }
    static async delete(id) {
        // Eliminación lógica (cambiar estado activo a falso) o física según prefieras
        return await prisma_1.prisma.user.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
exports.UserService = UserService;
