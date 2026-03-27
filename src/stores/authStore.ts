// stores/authStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User, LoginCredentials, RegisterData } from '@/types/auth';
import authService from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Инициализация из localStorage
  const init = async () => {
    try {
      const savedUser = await authService.getCurrentUser();
      if (savedUser) {
        user.value = savedUser;
        isAuthenticated.value = true;
      }
    } catch (err) {
      console.error('Auth init error:', err);
    }
  };

  // Вход
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const loggedUser = await authService.login(credentials);
      user.value = loggedUser;
      isAuthenticated.value = true;
      
      // Сохраняем в localStorage
      localStorage.setItem('user', JSON.stringify(loggedUser));
      if (credentials.rememberMe) {
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
      }
      
      return true;
    } catch (err: any) {
      error.value = err.message || 'Ошибка при входе';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Регистрация
  const register = async (data: RegisterData) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const newUser = await authService.register(data);
      user.value = newUser;
      isAuthenticated.value = true;
      
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    } catch (err: any) {
      error.value = err.message || 'Ошибка при регистрации';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Выход
  const logout = async () => {
    isLoading.value = true;
    try {
      await authService.logout();
      user.value = null;
      isAuthenticated.value = false;
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Очистка ошибок
  const clearError = () => {
    error.value = null;
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    init,
    login,
    register,
    logout,
    clearError
  };
});