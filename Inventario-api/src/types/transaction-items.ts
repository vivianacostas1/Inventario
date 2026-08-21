export interface CreatePurchaseItemDTO {
  purchaseId: string;
  productId: string;
  quantity: number;
  unitCost: number;
}