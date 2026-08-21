
import api from './axios';

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  create: async (data: { name: string; description?: string }) => {
  const response = await api.post('/categories', data);
  return response.data;
}
  
};