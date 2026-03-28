<!-- views/Dashboard.vue - добавляем навигацию -->
<template>
  <div class="dashboard">
    <div class="welcome-section">
      <h1 class="welcome-title">🎉 Привет, {{ user?.username }}! Готов к новым приключениям? 🎉</h1>
      <div class="hero-card">
        <div
          ref="robotAnimationRef"
          class="robot-animation"
          aria-hidden="true"
        />
        <div class="hero-copy">
          <h2>Кубик-робот уже на старте</h2>
          <p>Он встречает ребёнка на главном экране и мягко оживляет интерфейс без перегруза.</p>
        </div>
      </div>
    </div>

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
import lottie, { type AnimationItem } from 'lottie-web';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import cubeRobotIdle from '@/assets/animations/cube_robot_idle.json';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const user = authStore.user;
const robotAnimationRef = ref<HTMLDivElement | null>(null);
let robotAnimation: AnimationItem | null = null;

const goToLessons = () => router.push('/lessons');
const goToLeaderboard = () => router.push('/leaderboard');
const goToCommunity = () => router.push('/community');

onMounted(() => {
  if (!robotAnimationRef.value) {
    return;
  }

  robotAnimation = lottie.loadAnimation({
    container: robotAnimationRef.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: cubeRobotIdle,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet'
    }
  });
});

onBeforeUnmount(() => {
  robotAnimation?.destroy();
  robotAnimation = null;
});
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.welcome-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.welcome-title {
  text-align: center;
  margin-bottom: 0;
  font-size: 32px;
  color: #ffffff;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  font-weight: bold;
  background: linear-gradient(135deg, #fff, #ffe6e6);
  -webkit-background-clip: text;
  background-clip: text;
  color: white;
}

.hero-card {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  align-items: center;
  gap: 24px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 28px;
  backdrop-filter: blur(12px);
}

.robot-animation {
  width: min(100%, 280px);
  aspect-ratio: 1;
  margin: 0 auto;
}

.hero-copy h2 {
  margin: 0 0 10px;
  font-size: 28px;
  color: #fff7ef;
}

.hero-copy p {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
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

@media (max-width: 720px) {
  .hero-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-copy h2 {
    font-size: 24px;
  }
}
</style>
