"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../config/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_super_seguro";
class AuthService {
    static async register(data) {
        // 1. Verificar si el usuario ya existe (Usando prisma.user)
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error("El correo electrónico ya está registrado");
        }
        // 2. Encriptar la contraseña
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        // 3. Crear el usuario en la base de datos (Usando prisma.user)
        const newUser = await prisma_1.prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword, // Ojo: en tu schema el campo se llama passwordHash
                name: data.nombre, // Ojo: en tu schema el campo se llama name
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
        return newUser;
    }
    static async login(data) {
        // 1. Buscar el usuario (Usando prisma.user)
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error("Credenciales inválidas");
        }
        // 2. Verificar la contraseña (usando passwordHash de tu esquema)
        const isPasswordValid = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error("Credenciales inválidas");
        }
        // 3. Generar el Token JWT (expira en 24 horas)
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: String(user.role) }, JWT_SECRET, { expiresIn: "24h" });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
}
exports.AuthService = AuthService;
