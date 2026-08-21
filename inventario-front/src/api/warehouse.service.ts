import api from './axios';
import type { Warehouse } from '../types/warehouse'; 

export const warehouseService = {
  async getAll(): Promise<Warehouse[]> {
    const response = await api.get<Warehouse[]>('/warehouses');
    return response.data;
  },

  async create(data: Omit<Warehouse, 'id'>): Promise<Warehouse> {
    const response = await api.post<Warehouse>('/warehouses', data);
    return response.data;
  },

  async update(id: string, data: Partial<Warehouse>): Promise<Warehouse> {
    const response = await api.put<Warehouse>(`/warehouses/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/warehouses/${id}`);
  },
};