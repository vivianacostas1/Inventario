import { Request, Response } from "express";
import { ProductService } from "../services/products.service";

export class ProductController {

  static async getProducts(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();
      return res.json(products);
    } catch (error: any) {
      console.error("Error al obtener productos:", error);

      return res.status(500).json({
        error: "Error al obtener los productos",
        details: error.message || String(error),
      });
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      const product = await ProductService.getById(id);

      if (!product) {
        return res.status(404).json({
          error: "Producto no encontrado",
        });
      }

      return res.json(product);

    } catch (error: any) {
      console.error("Error al obtener producto:", error);

      return res.status(500).json({
        error: "Error al obtener el producto",
        details: error.message || String(error),
      });
    }
  }

  static async createProduct(req: Request, res: Response) {
    try {

      console.log("====================================");
      console.log("CREANDO PRODUCTO");
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);
      console.log("====================================");

      /*
       * IMPORTANTE:
       *
       * Estamos usando CloudinaryStorage.
       * Por lo tanto, Multer YA subió la imagen a Cloudinary.
       *
       * NO debemos volver a utilizar:
       * cloudinary.uploader.upload_stream()
       *
       * La URL ya está disponible en:
       * req.file.path
       */

      const imageUrl =
        req.file?.path ||
        req.body.imageUrl ||
        req.body.imagen ||
        null;

      console.log("IMAGEN CLOUDINARY:", imageUrl);

      const productData = {
        sku: req.body.sku,
        name: req.body.name,
        categoryId: req.body.categoryId,
        supplierId: req.body.supplierId,

        costPrice:
          req.body.costPrice !== undefined &&
          req.body.costPrice !== ""
            ? parseFloat(req.body.costPrice)
            : 0,

        unitPrice:
          req.body.unitPrice !== undefined &&
          req.body.unitPrice !== ""
            ? parseFloat(req.body.unitPrice)
            : 0,

        minStock:
          req.body.minStock !== undefined &&
          req.body.minStock !== ""
            ? parseInt(req.body.minStock, 10)
            : 0,

        maxStock:
          req.body.maxStock !== undefined &&
          req.body.maxStock !== ""
            ? parseInt(req.body.maxStock, 10)
            : undefined,

        imageUrl: imageUrl,
      };

      console.log("====================================");
      console.log("PRODUCT DATA ANTES DEL SERVICE");
      console.log(productData);
      console.log("IMAGEN:", productData.imageUrl);
      console.log("====================================");

      const newProduct = await ProductService.create(productData);

      console.log("====================================");
      console.log("PRODUCTO CREADO");
      console.log("ID:", newProduct.id);
      
      console.log("====================================");

      return res.status(201).json(newProduct);

    } catch (error: any) {

      console.error("====================================");
      console.error("ERROR AL CREAR PRODUCTO");
      console.error(error);
      console.error("STACK:", error?.stack);
      console.error("====================================");

      return res.status(400).json({
        error: "Error al crear el producto",
        details: error.message || String(error),
      });
    }
  }

  static async getNextSku(req: Request, res: Response) {
    try {
      const nextSku = await ProductService.getNextSku();

      return res.json({
        sku: nextSku,
      });

    } catch (error: any) {

      console.error("Error al generar SKU:", error);

      return res.status(500).json({
        error: "Error al generar SKU",
        details: error.message || String(error),
      });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {

      const id = String(req.params.id);

      console.log("====================================");
      console.log("ACTUALIZANDO PRODUCTO");
      console.log("ID:", id);
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);
      console.log("====================================");

      /*
       * CloudinaryStorage ya subió la imagen.
       * La nueva URL está en req.file.path.
       *
       * Si no se seleccionó una imagen nueva,
       * NO modificamos imageUrl.
       */

      const imageUrl = req.file?.path;

      const productData: any = {};

      if (
        req.body.name !== undefined &&
        req.body.name !== ""
      ) {
        productData.name = req.body.name;
      }

      if (
        req.body.categoryId !== undefined &&
        req.body.categoryId !== ""
      ) {
        productData.categoryId = req.body.categoryId;
      }

      if (
        req.body.supplierId !== undefined &&
        req.body.supplierId !== "" &&
        req.body.supplierId !== "null" &&
        req.body.supplierId !== "undefined"
      ) {
        productData.supplierId = req.body.supplierId;
      }

      if (
        req.body.sku !== undefined &&
        req.body.sku !== ""
      ) {
        productData.sku = req.body.sku;
      }

      if (
        req.body.costPrice !== undefined &&
        req.body.costPrice !== ""
      ) {
        productData.costPrice =
          parseFloat(req.body.costPrice);
      }

      if (
        req.body.unitPrice !== undefined &&
        req.body.unitPrice !== ""
      ) {
        productData.unitPrice =
          parseFloat(req.body.unitPrice);
      }

      if (
        req.body.minStock !== undefined &&
        req.body.minStock !== ""
      ) {
        productData.minStock =
          parseInt(req.body.minStock, 10);
      }

      if (
        req.body.maxStock !== undefined &&
        req.body.maxStock !== ""
      ) {
        productData.maxStock =
          parseInt(req.body.maxStock, 10);
      }

      /*
       * SOLO actualizamos la imagen si el usuario
       * seleccionó una nueva.
       */
      if (imageUrl) {
        productData.imageUrl = imageUrl;
      }

      console.log("====================================");
      console.log("DATOS PARA ACTUALIZAR");
      console.log(productData);
      console.log("IMAGEN:", productData.imageUrl);
      console.log("====================================");

      const updatedProduct =
        await ProductService.update(
          id,
          productData
        );

      console.log("====================================");
      console.log("PRODUCTO ACTUALIZADO");
      console.log("ID:", updatedProduct.id);
      
      console.log("====================================");

      return res.json(updatedProduct);

    } catch (error: any) {

      console.error("====================================");
      console.error("ERROR AL ACTUALIZAR PRODUCTO");
      console.error(error);
      console.error("STACK:", error?.stack);
      console.error("====================================");

      return res.status(400).json({
        error: "Error al actualizar el producto",
        details: error.message || String(error),
      });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {

      const id = String(req.params.id);

      await ProductService.delete(id);

      return res.json({
        message: "Producto desactivado correctamente",
      });

    } catch (error: any) {

      console.error("Error al eliminar producto:", error);

      return res.status(500).json({
        error: "Error al eliminar el producto",
        details: error.message || String(error),
      });
    }
  }
}
