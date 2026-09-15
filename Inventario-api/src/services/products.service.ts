import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import cloudinary from "../config/cloudinary";

// ============================================================
// PRISMA 7 + POSTGRESQL / NEON
// ============================================================

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

// ============================================================
// TIPOS
// ============================================================

interface ProductImageInput {
  url: string;
}

interface CreateProductData {
  sku?: string;
  name: string;
  description?: string;

  unitPrice: number | string;
  costPrice: number | string;

  categoryId: string;
  supplierId: string;

  minStock?: number | string;
  maxStock?: number | string | null;

  // Imagen principal
  imageUrl?: string | null;

  // Imágenes adicionales
  images?: ProductImageInput[];

  // Oferta
  isOnSale?: boolean | string;
  salePrice?: number | string | null;
}

interface UpdateProductData {
  sku?: string;
  name?: string;
  description?: string;

  unitPrice?: number | string;
  costPrice?: number | string;

  categoryId?: string;
  supplierId?: string;

  minStock?: number | string;
  maxStock?: number | string | null;

  // Imagen principal
  imageUrl?: string | null;

  // Imágenes adicionales
  images?: ProductImageInput[];

  // Oferta
  isOnSale?: boolean | string;
  salePrice?: number | string | null;
}

// ============================================================
// SERVICIO DE PRODUCTOS
// ============================================================

export class ProductService {

  // ==========================================================
  // CONVERTIR BOOLEAN
  // ==========================================================

  private static parseBoolean(
    value: boolean | string | undefined,
    defaultValue = false
  ): boolean {

    if (value === undefined) {
      return defaultValue;
    }

    if (typeof value === "boolean") {
      return value;
    }

    return (
      value === "true" ||
      value === "1"
    );
  }

  // ==========================================================
  // SUBIR IMAGEN A CLOUDINARY
  // ==========================================================

  private static uploadImage(
    file: Express.Multer.File
  ): Promise<string> {

    return new Promise((resolve, reject) => {

      if (!file?.buffer) {

        reject(
          new Error(
            `El archivo ${
              file?.originalname || "desconocido"
            } no contiene buffer.`
          )
        );

        return;
      }

      const stream =
        cloudinary.uploader.upload_stream(
          {
            folder:
              "inventario/productos",

            resource_type:
              "image",
          },

          (error, result) => {

            if (error) {

              console.error(
                "ERROR CLOUDINARY:",
                error
              );

              reject(
                new Error(
                  `Error al subir la imagen ${file.originalname} a Cloudinary.`
                )
              );

              return;
            }

            if (
              !result ||
              !result.secure_url
            ) {

              reject(
                new Error(
                  `Cloudinary no devolvió una URL para la imagen ${file.originalname}.`
                )
              );

              return;
            }

            console.log(
              "IMAGEN SUBIDA A CLOUDINARY:"
            );

            console.log(
              "Nombre:",
              file.originalname
            );

            console.log(
              "URL:",
              result.secure_url
            );

            console.log(
              "Public ID:",
              result.public_id
            );

            resolve(
              result.secure_url
            );
          }
        );

      stream.end(
        file.buffer
      );
    });
  }

  // ==========================================================
  // OBTENER TODOS LOS PRODUCTOS
  // ==========================================================

  static async getProducts() {

    return prisma.product.findMany({

      where: {
        isActive: true,
      },

      include: {

        category: true,

        supplier: true,

        images: true,

        shareholderProducts: {
          include: {
            shareholder: true,
          },
        },

      },

      orderBy: {
        createdAt: "desc",
      },

    });
  }

  // ==========================================================
  // OBTENER PRODUCTO POR ID
  // ==========================================================

  static async getProductById(
    id: string
  ) {

    if (
      !id ||
      typeof id !== "string"
    ) {

      throw new Error(
        "El ID del producto es obligatorio."
      );
    }

    return prisma.product.findUnique({

      where: {
        id,
      },

      include: {

        category: true,

        supplier: true,

        images: true,

        shareholderProducts: {
          include: {
            shareholder: true,
          },
        },

        stocks: {
          include: {
            warehouse: true,
          },
        },

      },

    });
  }

  // ==========================================================
  // OBTENER SIGUIENTE SKU
  // ==========================================================

  static async getNextSku() {

    const products =
      await prisma.product.findMany({

        select: {
          sku: true,
        },

      });

    let maxNumber = 0;

    for (
      const product of products
    ) {

      if (!product.sku) {
        continue;
      }

      const match =
        product.sku.match(
          /(\d+)$/
        );

      if (match) {

        const number =
          Number(match[1]);

        if (
          number >
          maxNumber
        ) {

          maxNumber =
            number;
        }
      }
    }

    const nextNumber =
      maxNumber + 1;

    return `PROD-${String(
      nextNumber
    ).padStart(5, "0")}`;
  }

  // ==========================================================
  // CREAR PRODUCTO
  // ==========================================================

  static async createProduct(
    data: CreateProductData,
    files: Express.Multer.File[] = []
  ) {

    return prisma.$transaction(
      async (tx) => {

        // ------------------------------------------------------
        // VALIDACIONES
        // ------------------------------------------------------

        if (
          !data.name ||
          !data.name.trim()
        ) {

          throw new Error(
            "El nombre del producto es obligatorio."
          );
        }

        if (!data.categoryId) {

          throw new Error(
            "La categoría es obligatoria."
          );
        }

        if (!data.supplierId) {

          throw new Error(
            "El proveedor es obligatorio."
          );
        }

        // ------------------------------------------------------
        // GENERAR SKU
        // ------------------------------------------------------

        let sku =
          data.sku?.trim();

        if (!sku) {

          const products =
            await tx.product.findMany({

              select: {
                sku: true,
              },

            });

          let maxNumber = 0;

          for (
            const product of products
          ) {

            if (!product.sku) {
              continue;
            }

            const match =
              product.sku.match(
                /(\d+)$/
              );

            if (match) {

              const number =
                Number(match[1]);

              if (
                number >
                maxNumber
              ) {

                maxNumber =
                  number;
              }
            }
          }

          sku =
            `PROD-${String(
              maxNumber + 1
            ).padStart(5, "0")}`;
        }

        // ------------------------------------------------------
        // VERIFICAR SKU
        // ------------------------------------------------------

        const existingSku =
          await tx.product.findUnique({

            where: {
              sku,
            },

          });

        if (existingSku) {

          throw new Error(
            `El SKU "${sku}" ya existe.`
          );
        }

        // ------------------------------------------------------
        // VERIFICAR CATEGORÍA
        // ------------------------------------------------------

        const category =
          await tx.category.findUnique({

            where: {
              id: data.categoryId,
            },

          });

        if (!category) {

          throw new Error(
            "La categoría no existe."
          );
        }

        // ------------------------------------------------------
        // VERIFICAR PROVEEDOR
        // ------------------------------------------------------

        const supplier =
          await tx.supplier.findUnique({

            where: {
              id: data.supplierId,
            },

          });

        if (!supplier) {

          throw new Error(
            "El proveedor no existe."
          );
        }

        // ------------------------------------------------------
        // PROCESAR OFERTA
        // ------------------------------------------------------

        const isOnSale =
          ProductService.parseBoolean(
            data.isOnSale,
            false
          );

        let salePrice: number | null = null;

        if (isOnSale) {
          if (
            data.salePrice === undefined ||
            data.salePrice === null ||
            data.salePrice === ""
          ) {
            throw new Error(
              "El precio de oferta es obligatorio cuando el producto está en oferta."
            );
          }

          salePrice = Number(data.salePrice);

          if (!Number.isFinite(salePrice) || salePrice <= 0) {
            throw new Error(
              "El precio de oferta debe ser mayor a 0."
            );
          }

          const unitPrice = Number(data.unitPrice);

          if (
            Number.isFinite(unitPrice) &&
            salePrice >= unitPrice
          ) {
            throw new Error(
              "El precio de oferta debe ser menor que el precio normal."
            );
          }
        }

        // ------------------------------------------------------
        // CREAR PRODUCTO
        // ------------------------------------------------------

        const product =
          await tx.product.create({

            data: {

              sku,

              name:
                data.name.trim(),

              description:
                data.description?.trim() ||
                null,

              unitPrice:
                Number(
                  data.unitPrice
                ) || 0,

              costPrice:
                Number(
                  data.costPrice
                ) || 0,

              categoryId:
                data.categoryId,

              supplierId:
                data.supplierId,

              minStock:
                data.minStock !==
                undefined
                  ? Number(
                      data.minStock
                    )
                  : 0,

              maxStock:
                data.maxStock === null ||
                data.maxStock ===
                  undefined
                  ? null
                  : Number(
                      data.maxStock
                    ),

              imageUrl:
                data.imageUrl ||
                null,

              // Oferta
              isOnSale,

              salePrice:
                isOnSale
                  ? salePrice
                  : null,

            },

          });

        // ------------------------------------------------------
        // SUBIR IMÁGENES NUEVAS
        // ------------------------------------------------------

        if (
          files &&
          files.length > 0
        ) {

          console.log(
            "================================"
          );

          console.log(
            "IMÁGENES PARA CREAR:",
            files.length
          );

          console.log(
            "================================"
          );

          for (
            const file of files
          ) {

            console.log(
              "SUBIENDO IMAGEN:",
              file.originalname
            );

            const imageUrl =
              await ProductService.uploadImage(
                file
              );

            await tx.productImage.create({

              data: {

                productId:
                  product.id,

                url:
                  imageUrl,

              },

            });
          }
        }

        // ------------------------------------------------------
        // IMÁGENES RECIBIDAS COMO DATA
        // ------------------------------------------------------

        if (
          data.images &&
          Array.isArray(
            data.images
          ) &&
          data.images.length > 0
        ) {

          await tx.productImage.createMany({

            data:
              data.images.map(
                (image) => ({

                  productId:
                    product.id,

                  url:
                    image.url,

                })
              ),

          });
        }

        // ------------------------------------------------------
        // DEVOLVER PRODUCTO
        // ------------------------------------------------------

        return tx.product.findUnique({

          where: {
            id: product.id,
          },

          include: {

            category: true,

            supplier: true,

            images: true,

            shareholderProducts: {
              include: {
                shareholder: true,
              },
            },

          },

        });
      }
    );
  }

  // ==========================================================
  // ACTUALIZAR PRODUCTO
  // ==========================================================

  static async updateProduct(
    id: string,
    data: UpdateProductData,
    files: Express.Multer.File[] = []
  ) {

    return prisma.$transaction(
      async (tx) => {

        // ------------------------------------------------------
        // BUSCAR PRODUCTO
        // ------------------------------------------------------

        const existingProduct =
          await tx.product.findUnique({

            where: {
              id,
            },

          });

        if (!existingProduct) {

          throw new Error(
            "El producto no existe."
          );
        }

        // ------------------------------------------------------
        // VERIFICAR SKU
        // ------------------------------------------------------

        if (
          data.sku !==
            undefined &&
          data.sku.trim() !==
            existingProduct.sku
        ) {

          const skuExists =
            await tx.product.findFirst({

              where: {

                sku:
                  data.sku.trim(),

                NOT: {
                  id,
                },

              },

            });

          if (skuExists) {

            throw new Error(
              `El SKU "${data.sku.trim()}" ya existe.`
            );
          }
        }

        // ------------------------------------------------------
        // VERIFICAR CATEGORÍA
        // ------------------------------------------------------

        if (
          data.categoryId !==
          undefined
        ) {

          const category =
            await tx.category.findUnique({

              where: {
                id:
                  data.categoryId,
              },

            });

          if (!category) {

            throw new Error(
              "La categoría no existe."
            );
          }
        }

        // ------------------------------------------------------
        // VERIFICAR PROVEEDOR
        // ------------------------------------------------------

        if (
          data.supplierId !==
          undefined
        ) {

          const supplier =
            await tx.supplier.findUnique({

              where: {
                id:
                  data.supplierId,
              },

            });

          if (!supplier) {

            throw new Error(
              "El proveedor no existe."
            );
          }
        }

        // ------------------------------------------------------
        // PROCESAR OFERTA
        // ------------------------------------------------------

        const newIsOnSale =
          data.isOnSale !==
          undefined
            ? ProductService.parseBoolean(
                data.isOnSale,
                false
              )
            : existingProduct.isOnSale;

        const newSalePrice =
          data.salePrice !==
          undefined
            ? (
                data.salePrice ===
                  null ||
                data.salePrice ===
                  ""
              )
                ? null
                : Number(
                    data.salePrice
                  )
            : existingProduct.salePrice;

        // ------------------------------------------------------
        // VALIDAR PRECIO DE OFERTA
        // ------------------------------------------------------

        if (newIsOnSale) {
  if (newSalePrice == null) {
    throw new Error(
      "El precio de oferta es obligatorio cuando el producto está en oferta."
    );
  }

  const salePriceNumber = Number(newSalePrice);

  if (
    !Number.isFinite(salePriceNumber) ||
    salePriceNumber <= 0
  ) {
    throw new Error(
      "El precio de oferta debe ser mayor a 0."
    );
  }

  const unitPriceNumber = Number(
    data.unitPrice !== undefined
      ? data.unitPrice
      : existingProduct.unitPrice
  );

  if (
    Number.isFinite(unitPriceNumber) &&
    salePriceNumber >= unitPriceNumber
  ) {
    throw new Error(
      "El precio de oferta debe ser menor que el precio normal."
    );
  }
}

        // ------------------------------------------------------
        // PREPARAR DATOS
        // ------------------------------------------------------

        const updateData: any = {};

        if (
          data.sku !==
          undefined
        ) {

          updateData.sku =
            data.sku.trim();
        }

        if (
          data.name !==
          undefined
        ) {

          updateData.name =
            data.name.trim();
        }

        if (
          data.description !==
          undefined
        ) {

          updateData.description =
            data.description?.trim() ||
            null;
        }

        if (
          data.unitPrice !==
          undefined
        ) {

          updateData.unitPrice =
            Number(
              data.unitPrice
            );
        }

        if (
          data.costPrice !==
          undefined
        ) {

          updateData.costPrice =
            Number(
              data.costPrice
            );
        }

        if (
          data.categoryId !==
          undefined
        ) {

          updateData.categoryId =
            data.categoryId;
        }

        if (
          data.supplierId !==
          undefined
        ) {

          updateData.supplierId =
            data.supplierId;
        }

        if (
          data.minStock !==
          undefined
        ) {

          updateData.minStock =
            Number(
              data.minStock
            );
        }

        if (
          data.maxStock !==
          undefined
        ) {

          updateData.maxStock =
            data.maxStock ===
              null ||
            data.maxStock ===
              ""
              ? null
              : Number(
                  data.maxStock
                );
        }

        if (
          data.imageUrl !==
          undefined
        ) {

          updateData.imageUrl =
            data.imageUrl;
        }

        // ------------------------------------------------------
        // OFERTA
        // ------------------------------------------------------

        updateData.isOnSale =
          newIsOnSale;

        updateData.salePrice =
          newIsOnSale
            ? newSalePrice
            : null;

        // ------------------------------------------------------
        // ACTUALIZAR PRODUCTO
        // ------------------------------------------------------

        await tx.product.update({

          where: {
            id,
          },

          data:
            updateData,

        });

        // ------------------------------------------------------
        // SUBIR IMÁGENES NUEVAS
        // ------------------------------------------------------

        if (
          files &&
          files.length > 0
        ) {

          console.log(
            "================================"
          );

          console.log(
            "IMÁGENES RECIBIDAS EN SERVICE:",
            files.length
          );

          console.log(
            "================================"
          );

          for (
            const file of files
          ) {

            console.log(
              "SUBIENDO A CLOUDINARY:",
              file.originalname
            );

            console.log(
              "TIPO:",
              file.mimetype
            );

            console.log(
              "TAMAÑO:",
              file.size
            );

            if (
              !file.buffer
            ) {

              throw new Error(
                `El archivo ${file.originalname} no contiene buffer.`
              );
            }

            const imageUrl =
              await ProductService.uploadImage(
                file
              );

            console.log(
              "URL OBTENIDA:",
              imageUrl
            );

            await tx.productImage.create({

              data: {

                productId:
                  id,

                url:
                  imageUrl,

              },

            });

            console.log(
              "IMAGEN GUARDADA EN PRODUCTIMAGE"
            );
          }
        }

        // ------------------------------------------------------
        // IMÁGENES QUE VIENEN COMO DATA
        // ------------------------------------------------------

        if (
          data.images &&
          Array.isArray(
            data.images
          ) &&
          data.images.length > 0
        ) {

          await tx.productImage.createMany({

            data:
              data.images.map(
                (image) => ({

                  productId:
                    id,

                  url:
                    image.url,

                })
              ),

          });
        }

        // ------------------------------------------------------
        // DEVOLVER PRODUCTO ACTUALIZADO
        // ------------------------------------------------------

        return tx.product.findUnique({

          where: {
            id,
          },

          include: {

            category: true,

            supplier: true,

            images: true,

            shareholderProducts: {
              include: {
                shareholder: true,
              },
            },

          },

        });
      }
    );
  }

  // ==========================================================
  // ELIMINAR / DESACTIVAR PRODUCTO
  // ==========================================================

  static async deleteProduct(
    id: string
  ) {

    if (
      !id ||
      typeof id !== "string"
    ) {

      throw new Error(
        "El ID del producto es obligatorio."
      );
    }

    const product =
      await prisma.product.findUnique({

        where: {
          id,
        },

      });

    if (!product) {

      throw new Error(
        "El producto no existe."
      );
    }

    return prisma.product.update({

      where: {
        id,
      },

      data: {
        isActive: false,
      },

    });
  }
}

// ============================================================
// EXPORT DEFAULT
// ============================================================

export default ProductService;
