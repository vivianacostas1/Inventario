"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email("El correo electrónico no es válido"),
    password: zod_1.z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    nombre: zod_1.z.string().min(2, "El nombre es obligatorio"),
    rolId: zod_1.z.string().uuid("El ID del rol debe ser un UUID válido").optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("El correo electrónico no es válido"),
    password: zod_1.z.string().min(1, "La contraseña es obligatoria"),
});
