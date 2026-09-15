export interface DeliveryZone {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  priority: number;
  zoneType: string;
  coordinates: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDeliveryZoneDTO {
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
  priority?: number;
  zoneType?: string;
  coordinates?: unknown;
}

export interface UpdateDeliveryZoneDTO {
  name?: string;
  description?: string;
  price?: number;
  isActive?: boolean;
  priority?: number;
  zoneType?: string;
  coordinates?: unknown;
}