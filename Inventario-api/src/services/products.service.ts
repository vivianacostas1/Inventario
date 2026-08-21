import { prisma } from "../config/prisma";
import { CreateProductDTO, UpdateProductDTO } from "../types/product";

export class ProductService {
  static async getAll() {
    const count = await prisma.product.count({
      where: { isActive: true },
    });

    if (count === 0) {
      return [];
    }

    return await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        supplier: true,
        shareholderProducts: {
          include: {
            shareholder: true,
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
        shareholderProducts: {
          include: {
            shareholder: true,
          },
        },
      },
    });
  }

  static async update(id: string, data: UpdateProductDTO) {
    const { shareholders, ...productData } = data as any;

    if (shareholders) {
      await prisma.shareholderProduct.deleteMany({
        where: { productId: id },
      });
    }

    return await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        shareholderProducts: shareholders ? {
          create: shareholders.map((shareholderId: string) => ({
            shareholder: { connect: { id: shareholderId } }
          }))
        } : undefined,
      },
      include: {
        category: true,
        supplier: true,
        shareholderProducts: { include: { shareholder: true } },
      },
    });
  }

  static async delete(id: string) {
    return await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Función auxiliar para generar el SKU automáticamente (ej. PROD1, PROD2...)
  private static async generateNextSku(): Promise<string> {
    const lastProduct = await prisma.product.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { sku: true },
    });

    if (!lastProduct || !lastProduct.sku) {
      return 'PROD1';
    }

    const match = lastProduct.sku.match(/\d+$/);
    if (!match) {
      return 'PROD1';
    }

    const nextNumber = parseInt(match[0], 10) + 1;
    return `PROD${nextNumber}`;
  }

  // Única función create limpia
  static async create(data: CreateProductDTO) {
    const { shareholders, ...productData } = data as any;

    const generatedSku = await ProductService.generateNextSku();

    return await prisma.product.create({
      data: {
        ...productData,
        sku: generatedSku,
        shareholderProducts: shareholders && shareholders.length > 0 ? {
          create: shareholders.map((shareholderId: string) => ({
            shareholder: { connect: { id: shareholderId } }
          }))
        } : undefined,
      },
      include: {
        category: true,
        supplier: true,
        shareholderProducts: { include: { shareholder: true } },
      },
    });
  }
  // Agrega esto a tu clase ProductService
static async getNextSku() {
  return await this.generateNextSku();
}
}