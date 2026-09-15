import api from "./axios";

export interface DeliveryZone {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  priority: number;
  zoneType: string;
  coordinates: unknown;
  createdAt: string;
  updatedAt: string;
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

export const getDeliveryZones = async (): Promise<DeliveryZone[]> => {
  const response = await api.get("/delivery-zones");
  return response.data;
};

export const getActiveDeliveryZones = async (): Promise<DeliveryZone[]> => {
  const response = await api.get("/delivery-zones/active");
  return response.data;
};

export const getDeliveryZoneById = async (
  id: string
): Promise<DeliveryZone> => {
  const response = await api.get(`/delivery-zones/${id}`);
  return response.data;
};

export const createDeliveryZone = async (
  data: CreateDeliveryZoneDTO
): Promise<DeliveryZone> => {
  const response = await api.post("/delivery-zones", data);
  return response.data;
};

export const updateDeliveryZone = async (
  id: string,
  data: UpdateDeliveryZoneDTO
): Promise<DeliveryZone> => {
  const response = await api.put(`/delivery-zones/${id}`, data);
  return response.data;
};

export const deleteDeliveryZone = async (
  id: string
): Promise<void> => {
  await api.delete(`/delivery-zones/${id}`);
};