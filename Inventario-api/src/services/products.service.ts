import { prisma } from "../config/prisma";
import {
  CreateProductDTO,
  UpdateProductDTO,
} from "../types/product";

export class ProductService {

  static async getAll() {
    return await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
        supplier: true,
        shareholderProducts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getById(id: string) {
    return await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
        supplier: true,
        stocks: {
          include: {
            warehouse: true,
          },
        },
        shareholderProducts: true,
      },
    });
  }

  private static async generateNextSku(): Promise<string> {
    const lastProduct = await prisma.product.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        sku: true,
      },
    });

    if (!lastProduct?.sku) {
      return "PROD1";
    }

    const match = lastProduct.sku.match(/\d+$/);

    if (!match) {
      return "PROD1";
    }

    const nextNumber =
      parseInt(match[0], 10) + 1;

    return `PROD${nextNumber}`;
  }

  // ==========================================
  // CREAR PRODUCTO
  // ==========================================

  static async create(data: CreateProductDTO) {

    if (!data) {
      throw new Error(
        "No se recibieron datos para crear el producto"
      );
    }

    const generatedSku =
      await ProductService.generateNextSku();

    const product =
      await prisma.product.create({
        data: {
          sku: generatedSku,

          name: data.name,

          description:
            data.description || null,

          categoryId:
            data.categoryId,

          supplierId:
            data.supplierId,

          costPrice:
            Number(data.costPrice),

          unitPrice:
            Number(data.unitPrice),

          minStock:
            data.minStock !== undefined
              ? Number(data.minStock)
              : 0,

          maxStock:
            data.maxStock !== undefined
              ? Number(data.maxStock)
              : null,

          imageUrl:
            data.imageUrl || null,
        },

        include: {
          category: true,
          supplier: true,
          shareholderProducts: true,
        },
      });

    return product;
  }

  // ==========================================
  // ACTUALIZAR PRODUCTO
  // ==========================================

  static async update(
    id: string,
    data: UpdateProductDTO
  ) {

    if (!data) {
      throw new Error(
        "No se recibieron datos para actualizar el producto"
      );
    }

    const productData: any = {};

    if (data.sku !== undefined) {
      productData.sku = data.sku;
    }

    if (data.name !== undefined) {
      productData.name = data.name;
    }

    if (data.description !== undefined) {
      productData.description =
        data.description;
    }

    if (data.categoryId !== undefined) {
      productData.categoryId =
        data.categoryId;
    }

    if (data.supplierId !== undefined) {
      productData.supplierId =
        data.supplierId;
    }

    if (data.costPrice !== undefined) {
      productData.costPrice =
        Number(data.costPrice);
    }

    if (data.unitPrice !== undefined) {
      productData.unitPrice =
        Number(data.unitPrice);
    }

    if (data.minStock !== undefined) {
      productData.minStock =
        Number(data.minStock);
    }

    if (data.maxStock !== undefined) {
      productData.maxStock =
        Number(data.maxStock);
    }

    if (data.imageUrl !== undefined) {
      productData.imageUrl =
        data.imageUrl;
    }

    if (data.isActive !== undefined) {
      productData.isActive =
        data.isActive;
    }

    return await prisma.product.update({
      where: {
        id,
      },

      data: productData,

      include: {
        category: true,
        supplier: true,
        shareholderProducts: true,
      },
    });
  }

  // ==========================================
  // ELIMINAR / DESACTIVAR
  // ==========================================

  static async delete(id: string) {
    return await prisma.product.update({
      where: {
        id,
      },

      data: {
        isActive: false,
      },
    });
  }

  // ==========================================
  // SIGUIENTE SKU
  // ==========================================

  static async getNextSku() {
    return await ProductService.generateNextSku();
  }
}
