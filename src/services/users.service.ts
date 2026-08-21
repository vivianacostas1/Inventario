import { prisma } from "../config/prisma"; // Asegúrate de tener tu instancia de prisma configurada
import { CreateUserDTO, UpdateUserDTO } from "../types/user.types";

export class UserService {
  static async getAll() {
    return await prisma.user.findMany({
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

  static async getById(id: string) {
    return await prisma.user.findUnique({
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

  static async create(data: CreateUserDTO) {
    return await prisma.user.create({
      data,
    });
  }

  static async update(id: string, data: UpdateUserDTO) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    // Eliminación lógica (cambiar estado activo a falso) o física según prefieras
    return await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}