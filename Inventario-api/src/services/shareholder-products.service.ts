import { prisma } from "../config/prisma";
import { AssignProductToShareholderDTO } from "../types/shareholder-product";

export class ShareholderProductService {
  // Listar todas las relaciones existentes
  static async getAll() {
    return await prisma.shareholderProduct.findMany({
      include: {
        shareholder: true,
        product: true,
      },
    });
  }

  // Asignar y sumar la cantidad de un producto a un accionista
  static async assignProduct(data: AssignProductToShareholderDTO & { quantity?: number }) {
    const quantityToAdd = data.quantity ?? 0;

    return await prisma.shareholderProduct.upsert({
      where: {
        shareholderId_productId: {
          shareholderId: data.shareholderId,
          productId: data.productId,
        },
      },
      update: {
        // Incrementa (suma) la cantidad nueva a la que ya existía en la base de datos
        quantity: {
          increment: quantityToAdd,
        },
      },
      create: {
        shareholderId: data.shareholderId,
        productId: data.productId,
        quantity: quantityToAdd,
      },
      include: {
        shareholder: true,
        product: true,
      },
    });
  }

  // Eliminar una asignación específica por el ID de la relación
  static async removeAssignment(id: string) {
    return await prisma.shareholderProduct.delete({
      where: { id },
    });
  }
}