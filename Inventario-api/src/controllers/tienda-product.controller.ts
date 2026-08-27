import { Request, Response } from 'express';
import { TiendaProductService } from '../services/tienda-product.service';

export class TiendaProductController {
  static async getTiendaProducts(req: Request, res: Response) {
    try {
      const products = await TiendaProductService.getTiendaProducts();
      return res.status(200).json(products);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ 
        error: "Error al obtener los productos para la tienda", 
        details: error.message 
      });
    }
  }
}