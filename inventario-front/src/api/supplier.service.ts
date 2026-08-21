import api from './axios';

export interface Supplier {
  id: string;
  name: string;
}

export const supplierService = {
  async getAll(): Promise<Supplier[]> {
    const response = await api.get('/suppliers');
    return response.data;
  },
};