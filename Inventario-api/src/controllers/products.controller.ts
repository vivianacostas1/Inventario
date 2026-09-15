import { Request, Response } from "express";
import { ProductService } from "../services/products.service";

export const ProductController = {

  // ============================================================
  // OBTENER PRODUCTOS
  // ============================================================

  async getProducts(
    req: Request,
    res: Response
  ) {
    try {

      const products =
        await ProductService.getProducts();

      return res.status(200).json(
        products
      );

    } catch (error: any) {

      console.error(
        "ERROR AL OBTENER PRODUCTOS:",
        error
      );

      return res.status(500).json({
        error:
          "Error al obtener los productos",

        message:
          error?.message,
      });
    }
  },

  // ============================================================
  // OBTENER PRODUCTO POR ID
  // ============================================================

  async getProductById(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        String(req.params.id);

      if (
        !id ||
        id === "undefined" ||
        id === "null"
      ) {

        return res.status(400).json({
          error:
            "El ID del producto es obligatorio",
        });
      }

      const product =
        await ProductService.getProductById(
          id
        );

      if (!product) {

        return res.status(404).json({
          error:
            "Producto no encontrado",
        });
      }

      return res.status(200).json(
        product
      );

    } catch (error: any) {

      console.error(
        "ERROR AL OBTENER PRODUCTO:",
        error
      );

      return res.status(500).json({
        error:
          "Error al obtener el producto",

        message:
          error?.message,
      });
    }
  },

  // ============================================================
  // SIGUIENTE SKU
  // ============================================================

  async getNextSku(
    req: Request,
    res: Response
  ) {

    try {

      const sku =
        await ProductService.getNextSku();

      return res.status(200).json({
        sku,
      });

    } catch (error: any) {

      console.error(
        "ERROR AL GENERAR SKU:",
        error
      );

      return res.status(500).json({
        error:
          "Error al generar el SKU",

        message:
          error?.message,
      });
    }
  },

  // ============================================================
  // CREAR PRODUCTO
  // ============================================================

  async createProduct(
    req: Request,
    res: Response
  ) {

    try {

      const files =
        Array.isArray(req.files)
          ? req.files as Express.Multer.File[]
          : [];

      console.log(
        "================================"
      );

      console.log(
        "CREAR PRODUCTO"
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "ARCHIVOS:",
        files.length
      );

      // --------------------------------------------------------
      // OBTENER URL DE IMÁGENES
      // --------------------------------------------------------

      const images = files
        .map((file) => {

          const anyFile =
            file as any;

          const url =
            anyFile.path ||
            anyFile.secure_url ||
            anyFile.url ||
            anyFile.location;

          return {
            url,
          };

        })
        .filter(
          (image) =>
            Boolean(image.url)
        );

      // --------------------------------------------------------
      // DATOS
      // --------------------------------------------------------

      const data = {

        sku:
          req.body.sku,

        name:
          req.body.name,

        description:
          req.body.description,

        categoryId:
          req.body.categoryId,

        supplierId:
          req.body.supplierId,

        costPrice:
          req.body.costPrice,

        unitPrice:
          req.body.unitPrice,

        minStock:
          req.body.minStock,

        maxStock:
          req.body.maxStock,

        // OFERTA
        isOnSale:
          req.body.isOnSale,

        salePrice:
          req.body.salePrice,

        images,

      };

      // --------------------------------------------------------
      // CREAR
      // --------------------------------------------------------

      const product =
        await ProductService.createProduct(
          data,
          files
        );

      return res.status(201).json({

        message:
          "Producto creado correctamente",

        product,

      });

    } catch (error: any) {

      console.error(
        "ERROR AL CREAR PRODUCTO:",
        error
      );

      return res.status(400).json({

        error:
          "No se pudo crear el producto",

        message:
          error?.message,

        details:
          error?.meta ||
          undefined,

      });
    }
  },

  // ============================================================
  // ACTUALIZAR PRODUCTO
  // ============================================================

  async updateProduct(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        String(req.params.id);

      if (
        !id ||
        id === "undefined" ||
        id === "null"
      ) {

        return res.status(400).json({
          error:
            "El ID del producto es obligatorio",
        });
      }

      const files =
        Array.isArray(req.files)
          ? req.files as Express.Multer.File[]
          : [];

      console.log(
        "================================"
      );

      console.log(
        "ACTUALIZAR PRODUCTO"
      );

      console.log(
        "ID:",
        id
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "ARCHIVOS:",
        files.length
      );

      // --------------------------------------------------------
      // DATOS
      // --------------------------------------------------------

      const data = {

        sku:
          req.body.sku,

        name:
          req.body.name,

        description:
          req.body.description,

        categoryId:
          req.body.categoryId,

        supplierId:
          req.body.supplierId,

        costPrice:
          req.body.costPrice,

        unitPrice:
          req.body.unitPrice,

        minStock:
          req.body.minStock,

        maxStock:
          req.body.maxStock,

        // OFERTA
        isOnSale:
          req.body.isOnSale,

        salePrice:
          req.body.salePrice,

      };

      // --------------------------------------------------------
      // ACTUALIZAR
      // --------------------------------------------------------

      const product =
        await ProductService.updateProduct(
          id,
          data,
          files
        );

      if (!product) {

        return res.status(404).json({
          error:
            "Producto no encontrado",
        });
      }

      return res.status(200).json({

        message:
          "Producto actualizado correctamente",

        product,

      });

    } catch (error: any) {

      console.error(
        "ERROR AL ACTUALIZAR PRODUCTO:",
        error
      );

      return res.status(400).json({

        error:
          "No se pudo actualizar el producto",

        message:
          error?.message,

        details:
          error?.meta ||
          undefined,

      });
    }
  },

  // ============================================================
  // ELIMINAR PRODUCTO
  // ============================================================

  async deleteProduct(
    req: Request,
    res: Response
  ) {

    try {

      const id =
        String(req.params.id);

      if (
        !id ||
        id === "undefined" ||
        id === "null"
      ) {

        return res.status(400).json({
          error:
            "El ID del producto es obligatorio",
        });
      }

      console.log(
        "ELIMINAR PRODUCTO ID:",
        id
      );

      const product =
        await ProductService.deleteProduct(
          id
        );

      if (!product) {

        return res.status(404).json({
          error:
            "Producto no encontrado",
        });
      }

      return res.status(200).json({

        message:
          "Producto eliminado correctamente",

        product,

      });

    } catch (error: any) {

      console.error(
        "ERROR AL ELIMINAR PRODUCTO:",
        error
      );

      return res.status(400).json({

        error:
          "No se pudo eliminar el producto",

        message:
          error?.message,

        details:
          error?.meta ||
          undefined,

      });
    }
  },
};

export default ProductController;
