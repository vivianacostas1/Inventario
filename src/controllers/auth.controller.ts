import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      // Validar con Zod
      const validationResult = registerSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Datos de registro inválidos", 
          details: validationResult.error.format() 
        });
      }

      const newUser = await AuthService.register(validationResult.data);
      return res.status(201).json(newUser);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || "Error al registrar usuario" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      // Validar con Zod
      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Datos de inicio de sesión inválidos", 
          details: validationResult.error.format() 
        });
      }

      const result = await AuthService.login(validationResult.data);
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message || "Error al iniciar sesión" });
    }
  }
}