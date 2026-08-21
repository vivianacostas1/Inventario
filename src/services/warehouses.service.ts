import { prisma } from "../config/prisma";
import { CreateWarehouseDTO, UpdateWarehouseDTO } from "../types/warehouse";

export class WarehouseService {
  static async getAll() {
    return await prisma.warehouse.findMany({
      include: {
        stocks: {
          include: {
            product: true, // Muestra los productos y cantidades que hay en este almacén
          },
        },
      },
    });
  }

  static async getById(id: string) {
    return await prisma.warehouse.findUnique({
      where: { id },
      include: {
        stocks: {
          include: {
            product: true,
          },
        },
        stockMovements: true, // Historial de movimientos en este almacén
      },
    });
  }

  static async create(data: CreateWarehouseDTO) {
    return await prisma.warehouse.create({
      data,
    });
  }

  static async update(id: string, data: UpdateWarehouseDTO) {
    return await prisma.warehouse.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return await prisma.warehouse.delete({
      where: { id },
    });
  }
}