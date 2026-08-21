import { prisma } from "../config/prisma";
import { CreatePurchaseItemDTO } from "../types/transaction-items";

export class PurchaseItemService {
  static async getByPurchaseId(purchaseId: string) {
    return await prisma.purchaseItem.findMany({
      where: { purchaseId },
      include: { product: true },
    });
  }

  static async create(data: CreatePurchaseItemDTO) {
    const subtotal = Number(data.quantity) * Number(data.unitCost);

    return await prisma.$transaction(async (tx) => {
      const purchaseItem = await tx.purchaseItem.create({
        data: {
          purchaseId: data.purchaseId,
          productId: data.productId,
          quantity: data.quantity,
          unitCost: data.unitCost,
          subtotal,
        },
        include: { product: true },
      });

      const allItems = await tx.purchaseItem.findMany({
        where: { purchaseId: data.purchaseId },
      });

      const totalAmount = allItems.reduce(
        (acc, item) => acc + Number(item.subtotal),
        0
      );

      await tx.purchase.update({
        where: { id: data.purchaseId },
        data: { totalAmount },
      });

      return purchaseItem;
    });
  }
}