import { prisma } from "../config/prisma";
import { CreateSaleItemDTO } from "../types/sale-items.types";

export class SaleItemService {
  static async getBySaleId(saleId: string) {
    return await prisma.saleItem.findMany({
      where: { saleId },
      include: {
        product: true,
      },
    });
  }

  static async create(data: CreateSaleItemDTO) {
    const subtotal = Number(data.quantity) * Number(data.unitPrice);

    return await prisma.$transaction(async (tx) => {
      // 1. Crear el ítem de venta
      const saleItem = await tx.saleItem.create({
        data: {
          saleId: data.saleId,
          productId: data.productId,
          quantity: data.quantity,
          unitPrice: data.unitPrice,
          subtotal,
        },
        include: {
          product: true,
        },
      });

      // 2. Recalcular y actualizar el monto total en la tabla de ventas principal
      const allItems = await tx.saleItem.findMany({
        where: { saleId: data.saleId },
      });

      const totalAmount = allItems.reduce(
        (acc, item) => acc + Number(item.subtotal),
        0
      );

      await tx.sale.update({
        where: { id: data.saleId },
        data: { totalAmount },
      });

      return saleItem;
    });
  }
}