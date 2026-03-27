// services/authService.ts
import type { LoginCredentials, RegisterData, User } from '@/types/auth';

// Имитация API запросов (заменить на реальные)
class AuthService {
  private mockDelay = 800;

  async login(credentials: LoginCredentials): Promise<User> {
    // Имитация запроса к серверу
    await new Promise((resolve) => setTimeout(resolve, this.mockDelay));

    // В реальном приложении здесь был бы fetch/axios запрос
    if (credentials.email === 'demo@codecraft.ru' && credentials.password === '123456') {
      return {
        id: '1',
        username: 'Юный Кодер',
        email: credentials.email,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeCraft',
        level: 5,
        xp: 4250,
        createdAt: new Date(),
      };
    }

    throw new Error('Неверный email или пароль');
  }

  async register(data: RegisterData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, this.mockDelay));

    // Проверка существования пользователя (mock)
    if (data.email === 'existing@codecraft.ru') {
      throw new Error('Пользователь с таким email уже существует');
    }

    return {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      level: 1,
      xp: 0,
      createdAt: new Date(),
    };
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }
}

export default new AuthService();
