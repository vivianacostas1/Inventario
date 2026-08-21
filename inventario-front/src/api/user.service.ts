import api from './axios';
import type { User } from '../types';

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async create(userData: { name: string; email: string; password: string; role: string }): Promise<User> {
    const response = await api.post<User>('/users', userData);
    return response.data;
  },

  async update(id: string, userData: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};