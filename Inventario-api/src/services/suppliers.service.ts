import { prisma } from "../config/prisma";

export class SupplierService {
  static async getAll() {
    return await prisma.supplier.findMany({
      where: { isActive: true },
    });
  }

  static async getById(id: string) {
    return await prisma.supplier.findUnique({
      where: { id },
    });
  }

  static async create(data: {
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
  }) {
    return await prisma.supplier.create({
      data,
    });
  }

  static async update(
    id: string,
    data: {
      name?: string;
      contactName?: string;
      email?: string;
      phone?: string;
      address?: string;
      taxId?: string;
    }
  ) {
    return await prisma.supplier.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    // Baja lógica basada en tu campo 'isActive' (@map("esta_activo"))
    return await prisma.supplier.update({
      where: { id },
      data: { isActive: false },
    });
  }
}