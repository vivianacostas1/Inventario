export interface CreateProductDTO {
  sku?: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  categoryId: string;
  supplierId: string;
  imageUrl?: string;
  minStock?: number;
  maxStock?: number;
}

export interface UpdateProductDTO {
  sku?: string;
  name?: string;
  description?: string;
  unitPrice?: number;
  costPrice?: number;
  categoryId?: string;
  supplierId?: string;
  imageUrl?: string;
  minStock?: number;
  maxStock?: number;
  isActive?: boolean;
}
