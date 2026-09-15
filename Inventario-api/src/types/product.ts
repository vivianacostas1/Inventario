export interface ProductImageDTO {
  id?: string;
  imageUrl: string;
}

export interface CreateProductDTO {
  sku?: string;
  name: string;
  description?: string;

  // Precios
  unitPrice: number;
  costPrice: number;

  // Oferta
  isOnSale?: boolean;
  salePrice?: number | null;

  categoryId: string;
  supplierId: string;

  // Imagen principal
  imageUrl?: string;

  // Imágenes adicionales
  images?: ProductImageDTO[];

  minStock?: number;
  maxStock?: number | null;
}

export interface UpdateProductDTO {
  sku?: string;
  name?: string;
  description?: string;

  // Precios
  unitPrice?: number;
  costPrice?: number;

  // Oferta
  isOnSale?: boolean;
  salePrice?: number | null;

  categoryId?: string;
  supplierId?: string;

  // Imagen principal
  imageUrl?: string;

  // Imágenes adicionales
  images?: ProductImageDTO[];

  minStock?: number;
  maxStock?: number | null;

  isActive?: boolean;
}