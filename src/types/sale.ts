export type SaleStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface SaleItemDTO {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSaleDTO {
  customerId?: string;
  userId: string;
  items: SaleItemDTO[];
}

export interface UpdateSaleStatusDTO {
  status: SaleStatus;
}