<!-- views/Achievements.vue -->
<template>
  <div class="achievements-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-emoji">🏅</span>
        Мои достижения
        <span class="title-emoji">⭐</span>
      </h1>
      <p class="page-subtitle">Собирай достижения и становись настоящим мастером кода!</p>
    </div>
    <div style="text-align: center;">
      <div class="mascot-container">
        <img :src="mascotImage" alt="Робот-маскот" class="mascot-image" />
        <div class="speech-bubble">Все твои достижения не будут забыты</div>
      </div>
    </div>

    <div class="achievements-stats">
      <div class="stat-card">
        <span class="stat-emoji">🏆</span>
        <span class="stat-number">{{ totalAchievements }}</span>
        <span class="stat-label">Всего достижений</span>
      </div>
      <div class="stat-card">
        <span class="stat-emoji">⭐</span>
        <span class="stat-number">{{ userAchievementsCount }}</span>
        <span class="stat-label">Твои достижения</span>
      </div>
      <div class="stat-card">
        <span class="stat-emoji">📊</span>
        <span class="stat-number">{{ completionPercent }}%</span>
        <span class="stat-label">Прогресс</span>
      </div>
    </div>

    <div class="achievements-grid">
      <div
        v-for="achievement in achievements"
        :key="achievement.id"
        class="achievement-card"
        :class="{ unlocked: achievement.unlocked, locked: !achievement.unlocked }"
      >
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <h3>{{ achievement.title }}</h3>
        <p>{{ achievement.description }}</p>
        <div class="achievement-xp">+{{ achievement.xpReward }} XP</div>
        <div
          v-if="!achievement.unlocked"
          class="achievement-lock"
        >
          🔒
        </div>
        <div
          v-else
          class="achievement-footer"
        >
          <span class="achievement-unlock-date"> 🎉 Получено: {{ achievement.unlockedDate }} </span>
          <button
            class="share-achievement-btn"
            @click="shareAchievement(achievement)"
          >
            📱 Поделиться
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mascotImage from '@/assets/images/9.png'
import { computed } from 'vue';
import { useUserStatsStore } from '@/stores/userStatsStore';

const userStatsStore = useUserStatsStore();

const achievements = computed(() => userStatsStore.achievements);
const totalAchievements = computed(() => userStatsStore.totalAchievements);
const userAchievementsCount = computed(() => userStatsStore.unlockedAchievementsCount);
const completionPercent = computed(() =>
  Math.round((userAchievementsCount.value / totalAchievements.value) * 100),
);

const shareAchievement = (achievement: any) => {
  const shareText = `🎉 Я получил достижение "${achievement.title}" в CodeCraft! 🎉\n\n${achievement.description}\n\n🏆 +${achievement.xpReward} XP\n\nПрисоединяйся ко мне в этом увлекательном приключении! 🚀\n\n#CodeCraft #Программирование #Достижение`;

  const shareUrl = encodeURIComponent(window.location.origin);
  const shareTitle = encodeURIComponent(`Моё достижение в CodeCraft: ${achievement.title}`);
  const shareDescription = encodeURIComponent(shareText);

  window.open(
    `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}&description=${shareDescription}&noparse=true`,
    'sharer',
    'toolbar=0,status=0,width=626,height=436',
  );
};
</script>

<style scoped>
.achievements-page {
  max-width: 1200px;
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

.achievements-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
}

.stat-emoji {
  font-size: 40px;
  display: block;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #ffd166;
  display: block;
}

.stat-label {
  color: white;
  font-size: 14px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.achievement-card.unlocked {
  background: linear-gradient(135deg, rgba(107, 203, 119, 0.2), rgba(78, 205, 196, 0.2));
  border: 1px solid #6bcb77;
}

.achievement-card.locked {
  opacity: 0.6;
  filter: grayscale(0.3);
}

.achievement-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.achievement-card h3 {
  color: white;
  margin-bottom: 10px;
}

.achievement-card p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-bottom: 10px;
}

.achievement-xp {
  color: #ffd166;
  font-weight: bold;
  margin-bottom: 12px;
}

.achievement-lock {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
}

.achievement-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.achievement-unlock-date {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  flex: 1;
  text-align: left;
}

.share-achievement-btn {
  background: #4c75a3;
  border: none;
  padding: 5px 12px;
  border-radius: 20px;
  color: white;
  font-size: 11px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.share-achievement-btn:hover {
  background: #3a5a80;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .achievements-page {
    padding: 15px;
  }

  .achievements-stats {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
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
