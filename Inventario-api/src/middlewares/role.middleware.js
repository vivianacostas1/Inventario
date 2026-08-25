"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const isAdmin = (req, res, next) => {
    // Verificamos que el usuario exista y que su rol sea ADMIN
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Acceso denegado. Se requiere rol de Administrador." });
    }
    next();
};
exports.isAdmin = isAdmin;
