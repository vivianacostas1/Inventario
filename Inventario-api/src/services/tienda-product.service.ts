import { prisma } from "../config/prisma";

export class TiendaProductService {
  static async getTiendaProducts() {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        stocks: true,
        category: {
          select: { name: true }
        }
      }
    });

    return products.map((product: any) => {
      const totalStock = product.stocks ? product.stocks.reduce((acc: number, curr: any) => acc + curr.quantity, 0) : 0;
      
      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        description: product.description,
        unitPrice: product.unitPrice,
        costPrice: product.costPrice,
        category: product.category?.name || 'General',
        stock: totalStock,
      };
    });
  }
}