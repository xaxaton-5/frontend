<!-- views/Dashboard.vue - добавляем навигацию -->
<template>
  <div class="dashboard">
    <!-- Контент дашборда (оставляем как есть) -->
    <div class="welcome-section">
      <h1 class="welcome-title">🎉 Привет, {{ user?.username }}! Готов к новым приключениям? 🎉</h1>
      <!-- Остальной контент дашборда -->
    </div>

    <!-- Модули для быстрого перехода -->
    <div class="quick-actions">
      <div
        class="action-card"
        @click="goToLessons"
      >
        <span class="action-emoji">📚</span>
        <h3>Продолжить обучение</h3>
        <p>Продолжи там, где остановился</p>
      </div>
      <div
        class="action-card"
        @click="goToLeaderboard"
      >
        <span class="action-emoji">🏆</span>
        <h3>Таблица лидеров</h3>
        <p>Соревнуйся с друзьями</p>
      </div>
      <div
        class="action-card"
        @click="goToCommunity"
      >
        <span class="action-emoji">💬</span>
        <h3>Сообщество</h3>
        <p>Общайся с другими кодерами</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;

const goToLessons = () => router.push('/lessons');
const goToLeaderboard = () => router.push('/leaderboard');
const goToCommunity = () => router.push('/community');
</script>

<style scoped>
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.action-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.25);
}

.action-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 15px;
}

.action-card h3 {
  color: white;
  margin-bottom: 8px;
}

.action-card p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}
</style>
