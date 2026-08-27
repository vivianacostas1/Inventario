import { prisma } from "../config/prisma";
import { CreateUserDTO, UpdateUserDTO } from "../types/user.types";
import bcrypt from "bcrypt";

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

  static async create(data: any) {
    // Ciframos la contraseña que viene del frontend
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword, // Asignamos correctamente el hash a Prisma
        role: data.role,
      },
    });
  }

  static async update(id: string, data: UpdateUserDTO) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}