"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_schema_1 = require("../schemas/auth.schema");
class AuthController {
    static async register(req, res) {
        try {
            // Validar con Zod
            const validationResult = auth_schema_1.registerSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: "Datos de registro inválidos",
                    details: validationResult.error.format()
                });
            }
            const newUser = await auth_service_1.AuthService.register(validationResult.data);
            return res.status(201).json(newUser);
        }
        catch (error) {
            return res.status(400).json({ error: error.message || "Error al registrar usuario" });
        }
    }
    static async login(req, res) {
        try {
            // Validar con Zod
            const validationResult = auth_schema_1.loginSchema.safeParse(req.body);
            if (!validationResult.success) {
                return res.status(400).json({
                    error: "Datos de inicio de sesión inválidos",
                    details: validationResult.error.format()
                });
            }
            const result = await auth_service_1.AuthService.login(validationResult.data);
            return res.json(result);
        }
        catch (error) {
            return res.status(401).json({ error: error.message || "Error al iniciar sesión" });
        }
    }
}
exports.AuthController = AuthController;
