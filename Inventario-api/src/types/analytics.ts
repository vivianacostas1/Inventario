export interface GeneralSummaryDTO {
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  profitMargin: number;
  totalInventoryValue: number;
}

export interface TopProductDTO {
  productId: string;
  productName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface AnalyticsResponseDTO {
  summary: GeneralSummaryDTO;
  topProducts: TopProductDTO[];
  alerts: any[];
}