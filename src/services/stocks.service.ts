import { prisma } from "../config/prisma";
import { CreateStockDTO, UpdateStockDTO, CreateStockMovementDTO } from "../types/stock";

export class StockService {
  // --- STOCK POR ALMACÉN ---
  static async getAllStock() {
    return await prisma.stock.findMany({
      include: {
        product: true,
        warehouse: true,
      },
    });
  }

  static async upsertStock(data: CreateStockDTO) {
    // Si ya existe el registro de stock para este producto en este almacén, lo actualiza o suma; si no, lo crea.
    return await prisma.stock.upsert({
      where: {
        productId_warehouseId: {
          productId: data.productId,
          warehouseId: data.warehouseId,
        },
      },
      update: {
        quantity: data.quantity,
      },
      create: {
        productId: data.productId,
        warehouseId: data.warehouseId,
        quantity: data.quantity,
      },
      include: {
        product: true,
        warehouse: true,
      },
    });
  }

  // --- MOVIMIENTOS DE STOCK ---
  static async getAllMovements() {
    return await prisma.stockMovement.findMany({
      include: {
        warehouse: true,
        product: true,
        user: true,
      },
    });
  }

  static async createMovement(data: CreateStockMovementDTO) {
    return await prisma.$transaction(async (tx) => {
      // 1. Crear el registro del movimiento (con tipado flexible para evitar conflictos de enum)
      const movement = await tx.stockMovement.create({
        data: data as any,
        include: {
          warehouse: true,
          product: true,
          user: true,
        },
      });

      // 2. Actualizar automáticamente el stock actual del producto en ese almacén
      const currentStock = await tx.stock.findUnique({
        where: {
          productId_warehouseId: {
            productId: data.productId,
            warehouseId: data.warehouseId,
          },
        },
      });

      const qtyChange = data.type === 'ENTRADA' ? data.quantity : -data.quantity;
      const newQuantity = (currentStock ? currentStock.quantity : 0) + qtyChange;

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