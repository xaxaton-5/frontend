// stores/authStore.ts
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import type { User, LoginCredentials, RegisterData } from '@/services/authService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const init = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    isLoading.value = true;
    try {
      const userData = await authService.auth();
      user.value = userData;
      isAuthenticated.value = true;
    } catch (err) {
      console.error('Auth init error:', err);
      localStorage.removeItem('access_token');
      user.value = null;
      isAuthenticated.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  // Вход
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await authService.login(credentials);
      user.value = response.user;
      isAuthenticated.value = true;
      localStorage.setItem('access_token', response.token);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.response?.data?.detail || 'Ошибка при входе';
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
      const response = await authService.register(data);
      user.value = response.user;
      isAuthenticated.value = true;
      localStorage.setItem('access_token', response.token);
      return true;
    } catch (err: any) {
      error.value =
        err.response?.data?.message || err.response?.data?.detail || 'Ошибка при регистрации';
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
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      user.value = null;
      isAuthenticated.value = false;
      isLoading.value = false;
    }
  };

  const setUserXp = (xpAmount: number) => {
    if (user.value) {
      user.value.exp = xpAmount;
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
    setUserXp,
    clearError,
  };
});
