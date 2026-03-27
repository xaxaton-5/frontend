<!-- components/auth/AuthModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="auth-modal-overlay"
    @click.self="handleClose"
  >
    <div class="auth-modal">
      <button
        class="close-btn"
        @click="handleClose"
      >
        <span>✕</span>
      </button>

      <div class="modal-header">
        <h2>
          <span
            v-if="isLoginMode"
            class="rainbow-text"
            >Добро пожаловать!</span
          >
          <span
            v-else
            class="rainbow-text"
            >Стань супер-кодером!</span
          >
        </h2>
        <p v-if="isLoginMode">🌟 Продолжи своё приключение в мире кода 🌟</p>
        <p v-else>🎮 Начни игру и освой программирование весело! 🎮</p>
      </div>

      <div class="mode-toggle">
        <button
          :class="{ active: isLoginMode }"
          @click="setMode(true)"
        >
          <span class="btn-emoji">🚀</span>
          Вход
        </button>
        <button
          :class="{ active: !isLoginMode }"
          @click="setMode(false)"
        >
          <span class="btn-emoji">🎨</span>
          Регистрация
        </button>
      </div>

      <transition
        name="slide"
        mode="out-in"
      >
        <LoginForm
          v-if="isLoginMode"
          :loading="authStore.isLoading"
          :error="authStore.error"
          @submit="handleLogin"
          @clear-error="authStore.clearError"
        />
        <RegisterForm
          v-else
          :loading="authStore.isLoading"
          :error="authStore.error"
          @submit="handleRegister"
          @clear-error="authStore.clearError"
        />
      </transition>

      <div class="decorations">
        <div class="floating-star star1">⭐</div>
        <div class="floating-star star2">🌟</div>
        <div class="floating-star star3">✨</div>
        <div class="floating-star star4">⭐</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RegisterData } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { LoginCredentials } from '@/types/auth';
import LoginForm from './LoginForm.vue';
import RegisterForm from './RegisterForm.vue';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  'login-success': [];
  'register-success': [];
}>();

const authStore = useAuthStore();
const isLoginMode = ref(true);

const setMode = (mode: boolean) => {
  isLoginMode.value = mode;
  authStore.clearError();
};

const handleLogin = async (credentials: LoginCredentials) => {
  const success = await authStore.login(credentials);
  if (success) {
    emit('login-success');
    emit('close');
  }
};

const handleRegister = async (data: RegisterData) => {
  const success = await authStore.register(data);
  if (success) {
    emit('register-success');
    emit('close');
  }
};

const handleClose = () => {
  emit('close');
  authStore.clearError();
};
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: bounceIn 0.5s ease;
  padding: 20px;
}

.auth-modal {
  position: relative;
  background: linear-gradient(135deg, #ffd166 0%, #ff6b6b 50%, #4ecdc4 100%);
  border-radius: 60px;
  padding: 40px;
  width: 90%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 5px solid white;
  animation: floatIn 0.6s ease;
}

/* Стили для скролла */
.auth-modal::-webkit-scrollbar {
  width: 8px;
}

.auth-modal::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.auth-modal::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

.auth-modal::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.7);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  color: #ff6b6b;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 20;
}

.close-btn:hover {
  transform: rotate(90deg) scale(1.1);
  background: #ff6b6b;
  color: white;
}

.modal-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.modal-header h2 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 12px;
  text-shadow: 3px 3px 0 rgba(0, 0, 0, 0.3);
}

.rainbow-text {
  background: linear-gradient(135deg, #ffffff, #ffe5b4, #fff0c0, #ffffff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 3s ease infinite;
  text-shadow: none;
  font-weight: 800;
}

.modal-header p {
  color: white;
  font-size: 14px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: rgba(0, 0, 0, 0.2);
  display: inline-block;
  padding: 5px 15px;
  border-radius: 30px;
  backdrop-filter: blur(5px);
}

.mode-toggle {
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  padding: 5px;
  border-radius: 60px;
  margin-bottom: 30px;
}

.mode-toggle button {
  flex: 1;
  padding: 12px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-weight: bold;
  border-radius: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.btn-emoji {
  font-size: 20px;
}

.mode-toggle button.active {
  background: white;
  color: #ff6b6b;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
  text-shadow: none;
}

.decorations {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.floating-star {
  position: absolute;
  font-size: 18px;
  animation: float 3s ease-in-out infinite;
  opacity: 0.6;
}

.star1 {
  top: 15px;
  left: 15px;
  animation-delay: 0s;
}

.star2 {
  top: 40px;
  right: 25px;
  animation-delay: 1s;
}

.star3 {
  bottom: 25px;
  left: 35px;
  animation-delay: 0.5s;
}

.star4 {
  bottom: 50px;
  right: 15px;
  animation-delay: 1.5s;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 768px) {
  .auth-modal {
    padding: 30px 20px;
  }

  .modal-header h2 {
    font-size: 28px;
  }

  .modal-header p {
    font-size: 11px;
  }

  .mode-toggle button {
    font-size: 14px;
    padding: 10px;
  }

  .btn-emoji {
    font-size: 18px;
  }
}
</style>
