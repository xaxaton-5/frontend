export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  username?: string;
  confirmPassword?: string;
  age?: string;
}
