export interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  createdAt: Date;
}

export interface CreateWarehouseDTO {
  name: string;
  location?: string;
}

export interface UpdateWarehouseDTO {
  name?: string;
  location?: string;
}