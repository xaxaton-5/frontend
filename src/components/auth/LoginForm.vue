<!-- components/auth/LoginForm.vue -->
<template>
  <form
    @submit.prevent="handleSubmit"
    class="auth-form"
  >
    <div class="form-group">
      <label for="email">
        <span class="label-emoji">📧</span>
        Твой email
      </label>
      <div class="input-wrapper">
        <input
          v-model="form.email"
          type="email"
          placeholder="например: magic@coder.ru"
          :class="{ error: errors.email }"
          @input="clearFieldError('email')"
        />
        <span class="input-icon">✉️</span>
      </div>
      <span
        v-if="errors.email"
        class="error-message"
      >
        <span class="error-emoji">😅</span> {{ errors.email }}
      </span>
    </div>

    <div class="form-group">
      <label for="password">
        <span class="label-emoji">🔑</span>
        Пароль
      </label>
      <div class="input-wrapper">
        <input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="••••••••"
          :class="{ error: errors.password }"
          @input="clearFieldError('password')"
        />
        <button
          type="button"
          class="toggle-password"
          @click="showPassword = !showPassword"
        >
          {{ showPassword ? '🙈' : '🐵' }}
        </button>
      </div>
      <span
        v-if="errors.password"
        class="error-message"
      >
        <span class="error-emoji">🔐</span> {{ errors.password }}
      </span>
    </div>

    <div class="form-options">
      <label class="checkbox">
        <input
          type="checkbox"
          v-model="form.rememberMe"
        />
        <span>🎮 Запомнить меня</span>
      </label>
      <button
        type="button"
        class="forgot-link"
        @click="forgotPassword"
      >
        🤔 Забыл пароль?
      </button>
    </div>

    <button
      type="submit"
      class="submit-btn"
      :disabled="loading"
    >
      <span v-if="!loading">🚀 Войти и играть! 🎮</span>
      <div
        v-else
        class="spinner"
      ></div>
    </button>

    <div
      v-if="error"
      class="error-alert"
    >
      <span class="error-emoji">😢</span> {{ error }} <span class="error-emoji">😢</span>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { LoginCredentials, ValidationErrors } from '@/types/auth';

const props = defineProps<{
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  submit: [credentials: LoginCredentials];
  'clear-error': [];
}>();

const form = reactive<LoginCredentials>({
  email: '',
  password: '',
  rememberMe: false,
});

const errors = reactive<ValidationErrors>({});
const showPassword = ref(false);

const validateForm = (): boolean => {
  const newErrors: ValidationErrors = {};

  if (!form.email) {
    newErrors.email = 'Напиши свой email!';
  } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Хм... это не похоже на email 😕';
  }

  if (!form.password) {
    newErrors.password = 'Нужен пароль!';
  } else if (form.password.length < 6) {
    newErrors.password = 'Слишком короткий пароль (нужно минимум 6 символов)';
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

const clearFieldError = (field: keyof ValidationErrors) => {
  delete errors[field];
  emit('clear-error');
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...form });
  }
};

const forgotPassword = () => {
  console.log('Forgot password');
};
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.label-emoji {
  font-size: 20px;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 20px 14px 48px;
  background: white;
  border: 3px solid #ffd166;
  border-radius: 50px;
  color: #5a3e2b;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 4px rgba(255, 107, 107, 0.2);
  transform: scale(1.02);
}

.input-wrapper input.error {
  border-color: #ff4757;
  background: #fff0f0;
}

.input-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}

.toggle-password {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  transition: transform 0.2s ease;
}

.toggle-password:hover {
  transform: translateY(-50%) scale(1.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin-top: 4px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.forgot-link {
  background: none;
  border: none;
  color: #ffd166;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: white;
}

.submit-btn {
  padding: 16px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ffd166 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  box-shadow: 0 6px 0 #cc5533;
  transform: translateY(-2px);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 0 #cc5533;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 4px 0 #cc5533;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: translateY(0);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto;
}

.error-message {
  color: #ffd966;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 20px;
  width: fit-content;
}

.error-emoji {
  font-size: 14px;
}

.error-alert {
  padding: 12px;
  background: rgba(255, 71, 87, 0.2);
  border: 2px solid #ff4757;
  border-radius: 50px;
  color: white;
  font-size: 14px;
  text-align: center;
  font-weight: bold;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
