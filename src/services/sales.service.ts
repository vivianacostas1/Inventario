import { prisma } from "../config/prisma";
import { CreateSaleDTO, SaleStatus } from "../types/sale";

export class SaleService {
  static async getAll() {
    return await prisma.sale.findMany({
      include: {
        customer: true,
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
    return await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        user: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async create(data: CreateSaleDTO) {
    const { customerId, userId, items } = data;

    let totalAmount = 0;
    const formattedItems = items.map((item) => {
      const subtotal = item.quantity * item.unitPrice;
      totalAmount += subtotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal,
      };
    });

    return await prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          customerId: customerId || null,
          userId,
          totalAmount,
          status: "PENDING",
          items: {
            create: formattedItems,
          },
        },
        include: {
          customer: true,
          user: true,
          items: {
            include: { product: true },
          },
        },
      });

      return sale;
    });
  }

  static async updateStatus(id: string, status: SaleStatus) {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!sale) {
      throw new Error("Venta no encontrada");
    }

    return await prisma.sale.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        user: true,
        items: { include: { product: true } },
      },
    });
  }
}