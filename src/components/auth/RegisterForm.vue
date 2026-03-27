<!-- components/auth/RegisterForm.vue -->
<template>
  <form
    @submit.prevent="handleSubmit"
    class="auth-form"
  >
    <div class="form-group">
      <label for="username">
        <span class="label-emoji">👤</span>
        Имя
      </label>
      <div class="input-wrapper">
        <input
          v-model="form.username"
          type="text"
          placeholder="Например: КодоМастер"
          :class="{ error: errors.username }"
          @input="clearFieldError('username')"
          maxlength="20"
        />
        <span class="input-icon">🎮</span>
      </div>
      <span
        v-if="errors.username"
        class="error-message"
      >
        <span class="error-emoji">😅</span> {{ errors.username }}
      </span>
      <div class="char-counter">{{ form.username.length }}/20</div>
    </div>

    <div class="form-group">
      <label for="email">
        <span class="label-emoji">📧</span>
        Email
      </label>
      <div class="input-wrapper">
        <input
          v-model="form.email"
          type="email"
          placeholder="tvoi@email.ru"
          :class="{ error: errors.email }"
          @input="clearFieldError('email')"
        />
        <span class="input-icon">📮</span>
      </div>
      <span
        v-if="errors.email"
        class="error-message"
      >
        <span class="error-emoji">📧</span> {{ errors.email }}
      </span>
    </div>

    <div class="form-group">
      <label for="password">
        <span class="label-emoji">🔐</span>
        Пароль
      </label>
      <div class="input-wrapper">
        <input
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Минимум 6 символов"
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
      <div
        class="password-strength"
        v-if="form.password"
      >
        <div
          class="strength-bar"
          :class="passwordStrength.class"
        ></div>
        <span class="strength-text">{{ passwordStrength.text }}</span>
      </div>
      <span
        v-if="errors.password"
        class="error-message"
      >
        <span class="error-emoji">🔒</span> {{ errors.password }}
      </span>
    </div>

    <div class="form-group">
      <label for="confirmPassword">
        <span class="label-emoji">✅</span>
        Подтверждение пароля
      </label>
      <div class="input-wrapper">
        <input
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="Повторите пароль"
          :class="{ error: errors.confirmPassword }"
          @input="clearFieldError('confirmPassword')"
        />
        <span class="input-icon">🔁</span>
      </div>
      <span
        v-if="errors.confirmPassword"
        class="error-message"
      >
        <span class="error-emoji">😅</span> {{ errors.confirmPassword }}
      </span>
    </div>

    <div class="agreement">
      <label class="checkbox">
        <input
          type="checkbox"
          v-model="agreeTerms"
        />
        <span
          >📜 Я согласен с правилами игры и
          <button
            type="button"
            class="link"
            @click="showTerms"
          >
            условиями
          </button>
          ✨</span
        >
      </label>
    </div>

    <button
      type="submit"
      class="submit-btn"
      :disabled="loading || !agreeTerms"
    >
      <span v-if="!loading">🎉 Стать супер-кодером! 🚀</span>
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
import { ref, reactive, computed } from 'vue';
import type { RegisterData, ValidationErrors } from '@/types/auth';

const props = defineProps<{
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  submit: [data: RegisterData];
  'clear-error': [];
}>();

const form = reactive<RegisterData>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  age: 7,
});

const errors = reactive<ValidationErrors>({});
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const agreeTerms = ref(false);

const passwordStrength = computed(() => {
  const pass = form.password;
  if (!pass) return { class: '', text: '' };

  let strength = 0;
  if (pass.length >= 6) strength++;
  if (pass.length >= 8) strength++;
  if (/[A-Z]/.test(pass)) strength++;
  if (/[0-9]/.test(pass)) strength++;
  if (/[^A-Za-z0-9]/.test(pass)) strength++;

  const strengthMap = {
    0: { class: 'very-weak', text: '😅 Очень слабый' },
    1: { class: 'weak', text: '😐 Слабый' },
    2: { class: 'medium', text: '🙂 Средний' },
    3: { class: 'strong', text: '😎 Сильный' },
    4: { class: 'very-strong', text: '🤩 Очень сильный!' },
    5: { class: 'excellent', text: '🏆 Превосходно!' },
  };

  return strengthMap[Math.min(strength, 5)];
});

const validateForm = (): boolean => {
  const newErrors: ValidationErrors = {};

  if (!form.username) {
    newErrors.username = 'Придумай крутое имя!';
  } else if (form.username.length < 3) {
    newErrors.username = 'Слишком короткое имя (минимум 3 буквы)';
  } else if (form.username.length > 20) {
    newErrors.username = 'Имя не может быть длиннее 20 символов';
  }

  if (!form.email) {
    newErrors.email = 'Напиши свой email!';
  } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Это не похоже на email 🤔';
  }

  if (!form.password) {
    newErrors.password = 'Придумай пароль!';
  } else if (form.password.length < 6) {
    newErrors.password = 'Нужно минимум 6 символов';
  }

  if (form.password !== form.confirmPassword) {
    newErrors.confirmPassword = 'Пароли не совпадают! 🔑';
  }

  Object.assign(errors, newErrors);
  return Object.keys(newErrors).length === 0;
};

const clearFieldError = (field: keyof ValidationErrors) => {
  delete errors[field];
  emit('clear-error');
};

const handleSubmit = () => {
  if (validateForm() && agreeTerms.value) {
    emit('submit', { ...form, age: 7 });
  }
};

const showTerms = () => {
  console.log('Show terms');
};
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  overflow-x: hidden;
  padding-bottom: 10px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.label-emoji {
  font-size: 18px;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  background: white;
  border: 2px solid #ffd166;
  border-radius: 40px;
  color: #5a3e2b;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  transform: scale(1.01);
}

.input-wrapper input.error {
  border-color: #ff4757;
  background: #fff0f0;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  pointer-events: none;
}

.toggle-password {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.char-counter {
  text-align: right;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: -4px;
}

.password-strength {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.strength-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s ease;
  max-width: 100%;
}

.strength-bar.very-weak {
  background: #ff4757;
  width: 20%;
}
.strength-bar.weak {
  background: #ffa502;
  width: 40%;
}
.strength-bar.medium {
  background: #ffd166;
  width: 60%;
}
.strength-bar.strong {
  background: #4ecdc4;
  width: 80%;
}
.strength-bar.very-strong {
  background: #6bcb77;
  width: 100%;
}
.strength-bar.excellent {
  background: #4d9de0;
  width: 100%;
}

.strength-text {
  font-size: 11px;
  color: white;
  font-weight: bold;
  white-space: nowrap;
}

.agreement {
  margin-top: 4px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: white;
  font-size: 12px;
  flex-wrap: wrap;
}

.checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.link {
  background: none;
  border: none;
  color: #ffd166;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
  font-weight: bold;
}

.submit-btn {
  padding: 14px;
  background: linear-gradient(135deg, #6bcb77 0%, #4ecdc4 100%);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 8px;
  box-shadow: 0 4px 0 #3b9e6b;
  transform: translateY(-1px);
  width: 100%;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #3b9e6b;
}

.submit-btn:active:not(:disabled) {
  transform: translateY(1px);
  box-shadow: 0 2px 0 #3b9e6b;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: translateY(0);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 0 auto;
}

.error-message {
  color: #ffd966;
  font-size: 11px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 8px;
  border-radius: 20px;
  width: fit-content;
  max-width: 100%;
  word-break: break-word;
}

.error-emoji {
  font-size: 12px;
}

.error-alert {
  padding: 10px;
  background: rgba(255, 71, 87, 0.2);
  border: 1px solid #ff4757;
  border-radius: 40px;
  color: white;
  font-size: 13px;
  text-align: center;
  font-weight: bold;
  word-break: break-word;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .auth-form {
    gap: 14px;
  }

  .submit-btn {
    font-size: 14px;
    padding: 12px;
  }

  .strength-text {
    font-size: 10px;
  }

  .checkbox span {
    font-size: 11px;
  }
}
</style>
