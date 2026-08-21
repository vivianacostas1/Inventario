import { prisma } from "../config/prisma";
import { CreateShareholderDTO, UpdateShareholderDTO } from "../types/shareholder";

export class ShareholderService {
  static async getAll() {
    const count = await prisma.shareholder.count({
      where: { isActive: true },
    });

    if (count === 0) {
      return []; 
    }

    return await prisma.shareholder.findMany({
      where: { isActive: true },
      include: {
        purchases: { 
          include: {
            items: { 
              include: {
                product: true, 
              },
            },
          },
        },
        shareholderProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async getById(id: string) {
    return await prisma.shareholder.findUnique({
      where: { id },
      include: {
        purchases: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
        shareholderProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  static async create(data: CreateShareholderDTO) {
    return await prisma.shareholder.create({
      data,
    });
  }

  static async update(id: string, data: UpdateShareholderDTO) {
    return await prisma.shareholder.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return await prisma.shareholder.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // MÉTODO ACTUALIZADO: Costo Total + Ganancia para la columna combinada
  static async getFinancialSummary() {
    const shareholders = await prisma.shareholder.findMany({
      where: { isActive: true },
      include: {
        shareholderProducts: {
          include: {
            product: true
          }
        }
      }
    });

    const completedSaleItems = await prisma.saleItem.findMany({
      where: {
        shareholderId: { not: null },
        sale: {
          status: "COMPLETED"
        }
      },
      include: {
        product: true
      }
    });

    return shareholders.map(sh => {
      const capitalInvertido = Number(sh.investmentAmount);
      const porcentaje = Number(sh.sharePercentage);
      let ingresosVentasProductos = 0;
      let gananciasAcumuladas = 0;
      let costosTotalesProductos = 0; // <--- NUEVA VARIABLE PARA ACUMULAR COSTOS

      const itemsDelAccionista = completedSaleItems.filter(item => item.shareholderId === sh.id);

      itemsDelAccionista.forEach(item => {
        const ingreso = Number(item.subtotal);
        const costoUnitario = Number(item.product.costPrice || 0);
        const costoTotal = costoUnitario * item.quantity;
        const gananciaItem = ingreso - costoTotal;

        ingresosVentasProductos += ingreso;
        costosTotalesProductos += costoTotal; // <--- ACUMULAMOS EL COSTO
        gananciasAcumuladas += gananciaItem; 
      });

      const totalADevolver = capitalInvertido + gananciasAcumuladas;
      
      // La columna solicitada: Costo de los productos vendidos + su ganancia
      const productSalesPlusProfit = costosTotalesProductos + gananciasAcumuladas;

      return {
        id: sh.id,
        name: sh.name,
        sharePercentage: porcentaje,
        investmentAmount: capitalInvertido,
        productSalesTotal: Number(ingresosVentasProductos.toFixed(2)),
        netProfit: Number(gananciasAcumuladas.toFixed(2)),
        productSalesPlusProfit: Number(productSalesPlusProfit.toFixed(2)),
        totalReturn: Number(totalADevolver.toFixed(2))
      };
    });
  }
}