import { Request, Response } from "express";
import { ProductService } from "../services/products.service";

export class ProductController {
  static async getProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener los productos" });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const product = await ProductService.getById(id);
      if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }
      return res.json(product);
    } catch (error) {
      return res.status(500).json({ error: "Error al obtener el producto" });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {
      const newProduct = await ProductService.create(req.body);
      return res.status(201).json(newProduct);
    } catch (error: any) {
      return res.status(400).json({ 
        error: "Error al crear el producto (verifique SKU único, categoría o proveedor válidos)",
        details: error.message 
      });
    }
  }
  static async getNextSku(req: Request, res: Response) {
    try {
      const nextSku = await ProductService.getNextSku();
      return res.json({ sku: nextSku });
    } catch (error) {
      return res.status(500).json({ error: "Error al generar SKU" });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updatedProduct = await ProductService.update(id, req.body);
      return res.json(updatedProduct);
    } catch (error) {
      return res.status(400).json({ error: "Error al actualizar el producto" });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      await ProductService.delete(id);
      return res.json({ message: "Producto desactivado correctamente" });
    } catch (error) {
      return res.status(500).json({ error: "Error al eliminar el producto" });
    }
  }
}