export type PurchaseStatus = 'PENDING' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseItemDTO {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseDTO {
  supplierId: string;
  userId: string;
  items: PurchaseItemDTO[];
}

export interface UpdatePurchaseStatusDTO {
  status: PurchaseStatus;
}