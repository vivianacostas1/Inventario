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
        shareholders: {
          include: {
            shareholder: true,
          },
        },
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

        shareholders: {
          include: {
            shareholder: true,
          },
        },
      },
    });
  }

  static async create(data: CreateProductDTO) {

    console.log("====================================");
    console.log("SERVICE CREATE");
    console.log("DATA:", data);
    console.log("IMAGE URL:", data?.imageUrl);
    console.log("====================================");

    if (!data) {
      throw new Error(
        "ProductService.create recibió data undefined"
      );
    }

    const productData = {
      sku: data.sku || "",
      name: data.name,

      description:
        data.description !== undefined
          ? data.description
          : null,

      unitPrice: Number(data.unitPrice),
      costPrice: Number(data.costPrice),

      categoryId: data.categoryId,
      supplierId: data.supplierId,

      imageUrl:
        data.imageUrl !== undefined
          ? data.imageUrl
          : null,

      minStock:
        data.minStock !== undefined
          ? Number(data.minStock)
          : 0,

      maxStock:
        data.maxStock !== undefined
          ? Number(data.maxStock)
          : null,
    };

    console.log("====================================");
    console.log("PRODUCT DATA PARA PRISMA");
    console.log(productData);
    console.log("IMAGEN A GUARDAR:");
    console.log(productData.imageUrl);
    console.log("====================================");

    return await prisma.product.create({
      data: productData,

      include: {
        category: true,
        supplier: true,

        shareholders: {
          include: {
            shareholder: true,
          },
        },
      },
    });
  }

  static async update(
    id: string,
    data: UpdateProductDTO
  ) {

    console.log("====================================");
    console.log("SERVICE UPDATE");
    console.log("ID:", id);
    console.log("DATA:", data);
    console.log("IMAGE URL:", data?.imageUrl);
    console.log("====================================");

    if (!data) {
      throw new Error(
        "ProductService.update recibió data undefined"
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

    if (data.unitPrice !== undefined) {
      productData.unitPrice =
        Number(data.unitPrice);
    }

    if (data.costPrice !== undefined) {
      productData.costPrice =
        Number(data.costPrice);
    }

    if (data.minStock !== undefined) {
      productData.minStock =
        Number(data.minStock);
    }

    if (data.maxStock !== undefined) {
      productData.maxStock =
        Number(data.maxStock);
    }

    /*
     * IMPORTANTE:
     *
     * Solo agregamos imageUrl cuando realmente
     * recibimos una nueva imagen.
     */
    if (data.imageUrl !== undefined) {
      productData.imageUrl =
        data.imageUrl;
    }

    if (data.isActive !== undefined) {
      productData.isActive =
        data.isActive;
    }

    console.log("====================================");
    console.log("PRODUCT DATA PARA UPDATE");
    console.log(productData);
    console.log("IMAGEN A GUARDAR:");
    console.log(productData.imageUrl);
    console.log("====================================");

    return await prisma.product.update({
      where: {
        id,
      },

      data: productData,

      include: {
        category: true,
        supplier: true,

        shareholders: {
          include: {
            shareholder: true,
          },
        },
      },
    });
  }

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

  private static async generateNextSku(): Promise<string> {

    const lastProduct =
      await prisma.product.findFirst({
        orderBy: {
          createdAt: "desc",
        },

        select: {
          sku: true,
        },
      });

    if (
      !lastProduct ||
      !lastProduct.sku
    ) {
      return "PROD1";
    }

    const match =
      lastProduct.sku.match(/\d+$/);

    if (!match) {
      return "PROD1";
    }

    const nextNumber =
      parseInt(match[0], 10) + 1;

    return `PROD${nextNumber}`;
  }

  static async getNextSku() {

    return await this.generateNextSku();
  }
}
