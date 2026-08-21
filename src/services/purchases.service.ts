import { prisma } from "../config/prisma";
import { CreatePurchaseDTO, PurchaseStatus } from "../types/purchase";

export class PurchaseService {
  static async getAll() {
    return await prisma.purchase.findMany({
      include: {
        supplier: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async getById(id: string) {
    return await prisma.purchase.findUnique({
      where: { id },
      include: {
        supplier: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async create(data: CreatePurchaseDTO) {
    const { supplierId, userId, items } = data;

    // Calcular subtotales y monto total de forma segura
    let totalAmount = 0;
    const formattedItems = items.map((item) => {
      const subtotal = item.quantity * item.unitCost;
      totalAmount += subtotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        subtotal,
      };
    });

    // Crear la compra junto con sus ítems en una transacción de Prisma
    return await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          supplierId,
          userId,
          totalAmount,
          status: "PENDING",
          items: {
            create: formattedItems,
          },
        },
        include: {
          supplier: true,
          user: true,
          items: {
            include: { product: true },
          },
        },
      });

      return purchase;
    });
  }

  static async updateStatus(id: string, status: PurchaseStatus) {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!purchase) {
      throw new Error("Compra no encontrada");
    }

    // Si la compra pasa a RECEIVED, opcionalmente podemos registrar la fecha de recepción
    const updateData: any = { status };
    if (status === "RECEIVED" && purchase.status !== "RECEIVED") {
      updateData.receivedAt = new Date();
    }

    return await prisma.purchase.update({
      where: { id },
      data: updateData,
      include: {
        supplier: true,
        user: true,
        items: { include: { product: true } },
      },
    });
  }
}