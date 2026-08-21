import { prisma } from "../config/prisma";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../types/category";

export class CategoryService {
  static async getAll() {
    return await prisma.category.findMany();
  }

  static async getById(id: string) {
    return await prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  static async create(data: CreateCategoryDTO) {
    return await prisma.category.create({
      data,
    });
  }

  static async update(id: string, data: UpdateCategoryDTO) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return await prisma.category.delete({
      where: { id },
    });
  }
}