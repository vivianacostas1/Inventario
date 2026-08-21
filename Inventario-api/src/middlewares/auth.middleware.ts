import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu_secreto_super_seguro";

// Extendemos la interfaz de Request de Express para que reconozca el usuario decodificado
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso denegado. No se proporcionó token o el formato es incorrecto" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
    req.user = decoded; // Guardamos los datos del usuario en la request
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};