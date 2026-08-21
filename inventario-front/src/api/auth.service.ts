import api from './axios';
import type{ AuthResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    // 👇 GUARDA EL TOKEN AQUÍ AUTOMÁTICAMENTE 👇
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token'); // Limpia también el token al salir
    await api.post('/auth/logout');
  },

  async getProfile(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/auth/profile');
    return response.data;
  },
};