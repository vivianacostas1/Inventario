import { prisma } from "../config/prisma";

export class TiendaProductService {
  static async getTiendaProducts() {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },

      include: {
        stocks: true,

        category: {
          select: {
            name: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return products.map((product: any) => {
      const totalStock = product.stocks
        ? product.stocks.reduce(
            (acc: number, curr: any) =>
              acc + Number(curr.quantity || 0),
            0
          )
        : 0;

      const unitPrice = Number(product.unitPrice || 0);

      const costPrice = Number(product.costPrice || 0);

      const isOnSale = product.isOnSale === true;

      const salePrice =
        isOnSale && product.salePrice != null
          ? Number(product.salePrice)
          : null;

      const discountPercentage =
        isOnSale &&
        salePrice != null &&
        unitPrice > 0
          ? Math.round(
              ((unitPrice - salePrice) /
                unitPrice) *
                100
            )
          : 0;

      return {
        id: product.id,

        sku: product.sku,

        name: product.name,

        description: product.description,

        // PRECIOS
        unitPrice: unitPrice,

        costPrice: costPrice,

        // OFERTA
        isOnSale: isOnSale,

        salePrice: salePrice,

        // COMPATIBILIDAD
        isOffer: isOnSale,

        originalPrice: unitPrice,

        discountPercentage: discountPercentage,

        // IMAGEN
        imageUrl: product.imageUrl || null,

        // CATEGORIA
        category:
          product.category?.name || "General",

        // STOCK
        stock: totalStock,

        // DISPONIBILIDAD
        available: totalStock > 0,
      };
    });
  }
}