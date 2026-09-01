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
            (acc: number, curr: any) => acc + Number(curr.quantity || 0),
            0
          )
        : 0;

      const unitPrice = Number(product.unitPrice || 0);
      const costPrice = Number(product.costPrice || 0);

      return {
        id: product.id,
        sku: product.sku,

        name: product.name,

        description: product.description,

        // PRECIOS
        unitPrice: unitPrice,
        costPrice: costPrice,

        // IMAGEN DE CLOUDINARY
        imageUrl: product.imageUrl || null,

        // CATEGORIA
        category: product.category?.name || "General",

        // STOCK
        stock: totalStock,

        // DATOS PARA LA TIENDA
        available: totalStock > 0,

        // Por ahora calculamos si tiene margen.
        // Después podemos crear un campo específico para ofertas.
        isOffer: false,
        originalPrice: unitPrice,
        discountPercentage: 0,
      };
    });
  }
}
