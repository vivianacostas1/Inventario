import { prisma } from "../config/prisma";
import { CreateDividendDTO, UpdateDividendDTO } from "../types/dividend";

export class DividendService {
  static async getAll() {
    return await prisma.dividend.findMany({
      include: {
        shareholder: true,
        product: true,
      } as any,
    });
  }

  static async getById(id: string) {
    return await prisma.dividend.findUnique({
      where: { id },
      include: {
        shareholder: true,
        product: true,
      } as any,
    });
  }

  static async create(data: CreateDividendDTO) {
    return await prisma.dividend.create({
      data: data as any,
      include: {
        shareholder: true,
        product: true,
      } as any,
    });
  }

  static async update(id: string, data: UpdateDividendDTO) {
    return await prisma.dividend.update({
      where: { id },
      data: data as any,
      include: {
        shareholder: true,
        product: true,
      } as any,
    });
  }

  static async delete(id: string) {
    return await prisma.dividend.delete({
      where: { id },
    });
  }
}