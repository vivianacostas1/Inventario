import { prisma } from "../config/prisma";

export class TiendaProductService {
  static async getTiendaProducts() {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        stocks: true,
        images: true,
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
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
      const isOnSale = product.isOnSale === true;
      const salePrice =
        isOnSale && product.salePrice != null
          ? Number(product.salePrice)
          : null;

      const discountPercentage =
        isOnSale && salePrice != null && unitPrice > 0
          ? Math.round(((unitPrice - salePrice) / unitPrice) * 100)
          : 0;

      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description,
        unitPrice,
        costPrice,
        isOnSale,
        salePrice,
        isOffer: isOnSale,
        originalPrice: unitPrice,
        discountPercentage,
        imageUrl: product.imageUrl || null,
        images: Array.isArray(product.images)
          ? product.images.map((image: any) => ({
              id: image.id,
              url: image.url,
            }))
          : [],
        category: product.category?.name || "General",
        stock: totalStock,
        available: totalStock > 0,
      };
    });
  }
}
