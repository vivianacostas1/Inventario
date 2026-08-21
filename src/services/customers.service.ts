import { prisma } from "../config/prisma";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../types/customer";

export class CustomerService {
  static async getAll() {
    return await prisma.customer.findMany({
      include: {
        sales: true, // Incluye el historial de ventas asociadas al cliente
      },
    });
  }

  static async getById(id: string) {
    return await prisma.customer.findUnique({
      where: { id },
      include: {
        sales: true,
      },
    });
  }

  static async create(data: CreateCustomerDTO) {
    return await prisma.customer.create({
      data,
    });
  }

  static async update(id: string, data: UpdateCustomerDTO) {
    return await prisma.customer.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return await prisma.customer.delete({
      where: { id },
    });
  }
}