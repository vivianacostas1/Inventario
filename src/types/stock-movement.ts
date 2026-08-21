export type MovementType = 'ENTRADA' | 'SALIDA';

export interface StockMovement {
  id: string;
  warehouseId: string;
  productId: string;
  userId: string;
  type: MovementType;
  quantity: number;
  referenceId: string | null;
  createdAt: Date;
}

export interface CreateStockMovementDTO {
  warehouseId: string;
  productId: string;
  userId: string;
  type: MovementType;
  quantity: number;
  referenceId?: string;
}