<!-- views/Dashboard.vue - добавляем навигацию -->
<template>
  <div class="dashboard">
    <!-- Контент дашборда (оставляем как есть) -->
    <div class="welcome-section">
      <h1 class="welcome-title">🎉 Привет, {{ user?.username }}! Готов к новым приключениям? 🎉</h1>
      
      <!-- Остальной контент дашборда -->
    </div>
    <div style="text-align: center;">
      <div class="mascot-container">
        <img :src="mascotImage" alt="Робот-маскот" class="mascot-image" />
        <div class="speech-bubble">Привет! Полетели! 🚀</div>
      </div>
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
import mascotImage from '@/assets/images/1.png'
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
.welcome-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 32px;
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  background: linear-gradient(135deg, #fff, #ffe6e6);
  -webkit-background-clip: text;
  background-clip: text;
  color: white;
}

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

.mascot-container {
  position: relative;
  display: inline-block;
  margin: 20px 0;
}

.mascot-image {
  width: 150px;
  height: auto;
  animation: bounce 2s infinite;
}

.speech-bubble {
  position: absolute;
  top: -30px;
  right: -50px;
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  color: #5a3e2b;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 20px;
  border-width: 8px 8px 0 8px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}
</style>
