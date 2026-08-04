import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  nombre: z.string().min(2, "El nombre es obligatorio"),
  rolId: z.string().uuid("El ID del rol debe ser un UUID válido").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("El correo electrónico no es válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});