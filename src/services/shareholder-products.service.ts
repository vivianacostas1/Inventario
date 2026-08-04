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

  // Asignar un producto a un accionista
  static async assignProduct(data: AssignProductToShareholderDTO) {
    return await prisma.shareholderProduct.create({
      data,
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