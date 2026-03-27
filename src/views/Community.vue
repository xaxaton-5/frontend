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
const tabs = [
  { path: '/community/chat', name: 'Чат', emoji: '💬' },
  { path: '/community/achievements', name: 'Достижения', emoji: '🏅' },
  { path: '/community/projects', name: 'Проекты', emoji: '🎨' },
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
</style>
