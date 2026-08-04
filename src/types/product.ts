export interface CreateProductDTO {
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  categoryId: string;
  supplierId: string;
  minStock?: number;
  maxStock?: number;
  shareholders?: string[]; // IDs de los accionistas asociados a este producto
}

export interface UpdateProductDTO {
  sku?: string;
  name?: string;
  description?: string;
  unitPrice?: number;
  costPrice?: number;
  categoryId?: string;
  supplierId?: string;
  minStock?: number;
  maxStock?: number;
  isActive?: boolean;
  shareholders?: string[]; // IDs para actualizar los accionistas
}