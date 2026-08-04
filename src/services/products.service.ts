import { prisma } from "../config/prisma";
import { CreateProductDTO, UpdateProductDTO } from "../types/product";

export class ProductService {
  static async getAll() {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        supplier: true,
        shareholders: {
          include: {
            shareholder: true, // Trae la info detallada del accionista
          },
        },
      },
    });
  }

  static async getById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        stocks: {
          include: {
            warehouse: true,
          },
        },
        shareholders: {
          include: {
            shareholder: true,
          },
        },
      },
    });
  }

  static async create(data: CreateProductDTO) {
    const { shareholders, ...productData } = data;

    return await prisma.product.create({
      data: {
        ...productData,
        // Si mandan un array de IDs de accionistas, los vinculamos en la tabla intermedia
        shareholders: shareholders && shareholders.length > 0 ? {
          create: shareholders.map((shareholderId) => ({
            shareholder: { connect: { id: shareholderId } }
          }))
        } : undefined,
      },
      include: {
        category: true,
        supplier: true,
        shareholders: { include: { shareholder: true } },
      },
    });
  }

  static async update(id: string, data: UpdateProductDTO) {
    const { shareholders, ...productData } = data;

    // Si se envían accionistas para actualizar, podemos sincronizarlos limpiando los anteriores y creando los nuevos
    if (shareholders) {
      await prisma.shareholderProduct.deleteMany({
        where: { productId: id },
      });
    }

    return await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        shareholders: shareholders ? {
          create: shareholders.map((shareholderId) => ({
            shareholder: { connect: { id: shareholderId } }
          }))
        } : undefined,
      },
      include: {
        category: true,
        supplier: true,
        shareholders: { include: { shareholder: true } },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }
}