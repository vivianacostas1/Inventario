import { prisma } from "../config/prisma";
import { CreateDividendDTO, UpdateDividendDTO } from "../types/dividend";

export class DividendService {
  static async getAll() {
    return await prisma.dividend.findMany({
      include: {
        shareholder: true,
        product: true,
      },
    });
  }

  static async getById(id: string) {
    return await prisma.dividend.findUnique({
      where: { id },
      include: {
        shareholder: true,
        product: true,
      },
    });
  }

  static async create(data: CreateDividendDTO) {
    return await prisma.dividend.create({
      data: {
        shareholderId: data.shareholderId,
        productId: data.productId || null,
        amount: data.amount,
        period: data.period,
        notes: data.notes || null,
      },
      include: {
        shareholder: true,
        product: true,
      },
    });
  }

  static async update(id: string, data: UpdateDividendDTO) {
    return await prisma.dividend.update({
      where: { id },
      data,
      include: {
        shareholder: true,
        product: true,
      },
    });
  }

  static async delete(id: string) {
    return await prisma.dividend.delete({
      where: { id },
    });
  }
}