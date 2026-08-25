"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Esto protege TODAS las rutas que estén por debajo de esta línea
router.use(auth_middleware_1.verifyToken);
/**
 * GET /health
 * Verifica el estado del servidor y la conexión a la base de datos.
 * Útil para saber si la app está corriendo correctamente.
 */
router.get('/', async (req, res) => {
    try {
        // Ejecutar una consulta simple para verificar la BD 
        const result = await database_1.default.query('SELECT NOW() as timestamp, version() as pg_version');
        // Si llegamos aquí, la BD está conectada 
        res.status(200).json({
            status: 'ok',
            message: 'Inventario API funcionando correctamente 🚀',
            server: {
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
            },
            database: {
                status: 'connected',
                queryTimestamp: result.rows[0].timestamp,
            },
        });
    }
    catch (error) {
        // Si hay error, la BD no está disponible 
        const message = error instanceof Error ? error.message : "Error desconocido";
        res.status(500).json({
            status: 'error',
            message: 'Error al conectar con la base de datos',
            server: {
                timestamp: new Date().toISOString(),
            },
            database: {
                status: 'disconnected',
                error: message,
            },
        });
    }
});
exports.default = router;
