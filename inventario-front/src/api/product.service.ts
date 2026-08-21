import api from './axios';

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  unitPrice: number;
  costPrice: number;
  categoryId: string;
  supplierId: string;
  minStock: number;
  maxStock?: number;
  isActive: boolean;
  category?: {
    id: string;
    name: string;
  };
  supplier?: {
    id: string;
    name: string;
  };
  stocks?: Array<{
    quantity: number;
    warehouse: {
      name: string;
    };
  }>;
}

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  async create(productData: {
    sku: string;
    name: string;
    description?: string;
    unitPrice: number;
    costPrice: number;
    categoryId: string;
    supplierId: string;
    minStock?: number;
  }): Promise<Product> {
    const response = await api.post('/products', productData);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};