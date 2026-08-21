export interface UpdateProductAnalyticsDTO {
  currentStock?: number;
  avgMonthlySales?: number;
  daysWithoutMovement?: number;
  lastSaleAt?: Date | string;
  lastPurchaseAt?: Date | string;
  reorderPoint?: number;
  suggestedReorderQty?: number;
  isSlowMoving?: boolean;
  needsReorder?: boolean;
}