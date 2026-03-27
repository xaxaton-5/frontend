// services/authService.ts
import axiosInstance from '@/api/axiosInstance';

export interface User {
  id: number;
  username: string;
  email: string;
  exp: number;
  is_parent: boolean;
  children_count: number;
  date_joined: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  is_parent: boolean;
  parent_id?: number; // Добавляем опциональное поле parent_id
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/login/', credentials);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/register/', data);
    return response.data;
  },

  auth: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/');
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('access_token');
  },
};
