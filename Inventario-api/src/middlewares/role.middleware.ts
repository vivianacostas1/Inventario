import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware"; // O la ruta donde tengas tu interfaz

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Verificamos que el usuario exista y que su rol sea ADMIN
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Acceso denegado. Se requiere rol de Administrador." });
  }
  next();
};