<!-- views/Community.vue -->
<template>
  <div class="community-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-emoji">👥</span>
        Сообщество CodeCraft
        <span class="title-emoji">💬</span>
      </h1>
      <p class="page-subtitle">Общайся, делись успехами и находи новых друзей!</p>
    </div>

    <div style="text-align: center;">
      <div class="mascot-container">
        <img :src="mascotImage" alt="Робот-маскот" class="mascot-image" />
        <div class="speech-bubble">Пора завести новых друзей!</div>
      </div>
    </div>

    <!-- Вкладки -->
    <div class="community-tabs">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="tab-btn"
        :class="{ active: $route.path === tab.path }"
      >
        <span class="tab-emoji">{{ tab.emoji }}</span>
        {{ tab.name }}
      </router-link>
    </div>

    <!-- Дочерние страницы -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import mascotImage from '@/assets/images/4.png'
const tabs = [
  { path: '/community/chat', name: 'Чат', emoji: '💬' },
  { path: '/community/achievements', name: 'Достижения', emoji: '🏅' },
];
</script>

<style scoped>
.community-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 48px;
  color: white;
  text-shadow: 3px 3px 0 #ff6b6b;
  margin-bottom: 15px;
}

.title-emoji {
  font-size: 54px;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
}

.community-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
}

.tab-btn {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.tab-btn.active {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
}

.tab-emoji {
  font-size: 18px;
}

@media (max-width: 768px) {
  .community-page {
    padding: 15px;
  }

  .community-tabs {
    flex-wrap: wrap;
    gap: 10px;
  }

  .tab-btn {
    padding: 8px 16px;
    font-size: 12px;
  }

  .page-title {
    font-size: 32px;
  }

  .title-emoji {
    font-size: 36px;
  }
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
