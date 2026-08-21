export interface CreateSaleItemDTO {
  saleId: string;
  productId: string;
  quantity: number;
  unitPrice?: number;
  shareholderId?: string;       // <--- Agrega esta propiedad
  shareholderProductId?: string; // <--- Y esta si la necesitas en el servicio
}