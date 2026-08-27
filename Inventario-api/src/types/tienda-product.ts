export interface TiendaProductResponse {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  unitPrice: number;
  costPrice: number;
  category: string;
  stock: number;
}