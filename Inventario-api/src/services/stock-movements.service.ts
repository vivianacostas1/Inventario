import { prisma } from "../config/prisma";
import { CreateStockMovementDTO } from "../types/stock-movement";
import { MovementType } from "@prisma/client";

export class StockMovementService {
  static async getAll() {
    return await prisma.stockMovement.findMany({
      include: {
        warehouse: true,
        product: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getById(id: string) {
    return await prisma.stockMovement.findUnique({
      where: { id },
      include: {
        warehouse: true,
        product: true,
        user: true,
      },
    });
  }

  static async create(data: CreateStockMovementDTO) {
    return await prisma.$transaction(async (tx) => {
      // 1. Crear el registro del movimiento
      const movement = await tx.stockMovement.create({
        data: data as any,
        include: {
          warehouse: true,
          product: true,
          user: true,
        },
      });

      // 2. Buscar o calcular el stock actual en ese almacén
      const currentStock = await tx.stock.findUnique({
        where: {
          productId_warehouseId: {
            productId: data.productId,
            warehouseId: data.warehouseId,
          },
        },
      });

      // Si es IN suma, de lo contrario resta (como OUT)
      const qtyChange = data.type === MovementType.IN ? data.quantity : -data.quantity;
      const newQuantity = (currentStock ? currentStock.quantity : 0) + qtyChange;

      // 3. Actualizar o crear el registro de stock resultante
      await tx.stock.upsert({
        where: {
          productId_warehouseId: {
            productId: data.productId,
            warehouseId: data.warehouseId,
          },
        },
        update: { quantity: newQuantity },
        create: {
          productId: data.productId,
          warehouseId: data.warehouseId,
          quantity: Math.max(0, newQuantity),
        },
      });

      return movement;
    });
  }
}