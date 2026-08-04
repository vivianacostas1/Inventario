export interface Stock {
  id: string;
  productId: string;
  warehouseId: string;
  quantity: number;
}

export interface CreateStockDTO {
  productId: string;
  warehouseId: string;
  quantity: number;
}

export interface UpdateStockDTO {
  quantity: number;
}

export interface CreateStockMovementDTO {
  warehouseId: string;
  productId: string;
  userId: string;
  type: string; // Ej: 'ENTRADA', 'SALIDA', 'TRASLADO'
  quantity: number;
  referenceId?: string;
}