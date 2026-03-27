// services/usersService.ts
import axiosInstance from '@/api/axiosInstance';
import type { User } from './authService';

export const usersService = {
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users/list/');
    return response.data;
  },

  getChildren: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/user/children/');
    return response.data;
  },
};
