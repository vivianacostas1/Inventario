export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface SaleItemDTO {
  productId: string;
  quantity: number;
  unitPrice?: number;
  shareholderId?: string;       // <--- Agrégalo aquí
  shareholderProductId?: string; // <--- Y aquí
}

export interface CreateSaleDTO {
  customerId?: string;
  userId: string;
  items: SaleItemDTO[];
}

export interface UpdateSaleStatusDTO {
  status: SaleStatus;
}