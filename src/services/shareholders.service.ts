import { prisma } from "../config/prisma";
import { CreateShareholderDTO, UpdateShareholderDTO } from "../types/shareholder";

export class ShareholderService {
  static async getAll() {
    return await prisma.shareholder.findMany({
      where: { isActive: true },
      include: {
        products: {
          include: {
            product: true, // Muestra los productos en los que participa
          },
        },
        dividends: true, // Muestra sus dividendos históricos
      },
    });
  }

  static async getById(id: string) {
    return await prisma.shareholder.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        dividends: true,
      },
    });
  }

  static async create(data: CreateShareholderDTO) {
    return await prisma.shareholder.create({
      data,
    });
  }

  static async update(id: string, data: UpdateShareholderDTO) {
    return await prisma.shareholder.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    // Realizamos una baja lógica cambiando isActive a false
    return await prisma.shareholder.update({
      where: { id },
      data: { isActive: false },
    });
  }
}