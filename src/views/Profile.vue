<!-- views/Profile.vue -->
<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Шапка профиля -->
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-large">
            <img
              :src="user?.avatar"
              alt="Avatar"
            />
            <div class="level-badge-large">{{ userStatsStore.stats.level }}</div>
          </div>
          <div class="user-info">
            <h1>{{ user?.username }}</h1>
            <p class="user-email">{{ user?.email }}</p>
            <div class="user-stats-badge">
              <span>📅 Регистрация: {{ registrationDate }}</span>
              <span>🏆 Рейтинг: #{{ userRank }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Статистика -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <span class="stat-value">{{ userStatsStore.stats.totalXp }}</span>
            <span class="stat-label">Всего XP</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <span class="stat-value"
              >{{ userStatsStore.stats.completedLessons }}/{{ userStatsStore.totalLessons }}</span
            >
            <span class="stat-label">Пройдено уроков</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🎮</div>
          <div class="stat-info">
            <span class="stat-value"
              >{{ userStatsStore.completedGamesCount }}/{{ userStatsStore.totalGames }}</span
            >
            <span class="stat-label">Игр пройдено</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏅</div>
          <div class="stat-info">
            <span class="stat-value"
              >{{ userStatsStore.unlockedAchievementsCount }}/{{
                userStatsStore.totalAchievements
              }}</span
            >
            <span class="stat-label">Достижений</span>
          </div>
        </div>
      </div>

      <!-- Прогресс по модулям -->
      <div class="section-card">
        <div class="section-header">
          <h2>📚 Прогресс обучения</h2>
          <span class="section-total">{{ totalProgress }}% завершено</span>
        </div>
        <div class="modules-progress">
          <div
            v-for="module in modulesProgress"
            :key="module.id"
            class="module-progress-item"
          >
            <div class="module-info">
              <span class="module-name">{{ module.title }}</span>
              <span class="module-percent">{{ module.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: module.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Достижения -->
      <div class="section-card">
        <div class="section-header">
          <h2>🏅 Последние достижения</h2>
          <router-link
            to="/achievements"
            class="view-all"
            >Все достижения →</router-link
          >
        </div>
        <div class="achievements-grid">
          <div
            v-for="achievement in userStatsStore.recentAchievements"
            :key="achievement.id"
            class="achievement-card unlocked"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-info">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <span class="achievement-date"> 🎉 {{ achievement.unlockedDate }} </span>
            </div>
          </div>
          <div
            v-if="userStatsStore.recentAchievements.length === 0"
            class="achievement-card empty"
          >
            <div class="achievement-icon">🏆</div>
            <div class="achievement-info">
              <h4>Нет достижений</h4>
              <p>Пройди уроки и игры, чтобы получить первые достижения!</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Предстоящие достижения -->
      <div
        class="section-card"
        v-if="userStatsStore.upcomingAchievements.length > 0"
      >
        <div class="section-header">
          <h2>🔜 Следующие достижения</h2>
        </div>
        <div class="achievements-grid upcoming">
          <div
            v-for="achievement in userStatsStore.upcomingAchievements"
            :key="achievement.id"
            class="achievement-card locked"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <div class="achievement-info">
              <h4>{{ achievement.title }}</h4>
              <p>{{ achievement.description }}</p>
              <span class="achievement-locked">🔒 +{{ achievement.xpReward }} XP</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Активность -->
      <div class="section-card">
        <div class="section-header">
          <h2>📊 Активность</h2>
          <span class="activity-badge">За последние 7 дней</span>
        </div>
        <div class="activity-grid">
          <div class="activity-stat">
            <span class="activity-value">{{ userStatsStore.stats.dailyStreak }}</span>
            <span class="activity-label">Дней подряд</span>
          </div>
          <div class="activity-stat">
            <span class="activity-value">{{ userStatsStore.stats.lessonsCompletedThisWeek }}</span>
            <span class="activity-label">Уроков за неделю</span>
          </div>
          <div class="activity-stat">
            <span class="activity-value">{{ userStatsStore.stats.gamesCompletedThisWeek }}</span>
            <span class="activity-label">Игр за неделю</span>
          </div>
          <div class="activity-stat">
            <span class="activity-value">{{ userStatsStore.stats.xpEarnedThisWeek }}</span>
            <span class="activity-label">XP за неделю</span>
          </div>
        </div>
      </div>

      <!-- Кнопки действий -->
      <div class="actions-card">
        <button
          class="action-btn share-btn"
          @click="shareToVK"
        >
          Поделиться в ВК
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { modules, getTotalProgress } from '@/data/modules';
import { useAuthStore } from '@/stores/authStore';
import { useUserStatsStore } from '@/stores/userStatsStore';

const authStore = useAuthStore();
const userStatsStore = useUserStatsStore();
const user = computed(() => authStore.user);

// Демо-данные
const registrationDate = ref('15.03.2024');
const userRank = ref(42);

const totalProgress = computed(() => getTotalProgress());

// Прогресс по модулям
const modulesProgress = computed(() => {
  return modules.map((m) => ({
    id: m.id,
    title: m.title, // полный заголовок с эмодзи
    progress: m.progress,
  }));
});

const shareToVK = () => {
  const shareText = `Я изучаю программирование в CodeCraft! 🎮\n\n📊 Моя статистика:\n• Уровень: ${userStatsStore.stats.level}\n• XP: ${userStatsStore.stats.totalXp}\n• Уроков пройдено: ${userStatsStore.stats.completedLessons}/${userStatsStore.totalLessons}\n• Игр пройдено: ${userStatsStore.completedGamesCount}/${userStatsStore.totalGames}\n• Достижений: ${userStatsStore.unlockedAchievementsCount}/${userStatsStore.totalAchievements}\n\nПрисоединяйся ко мне! 🚀`;

  const shareUrl = encodeURIComponent(window.location.origin);
  const shareTitle = encodeURIComponent('CodeCraft - Изучай программирование играя!');
  const shareDescription = encodeURIComponent(shareText);

  window.open(
    `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}&description=${shareDescription}&noparse=true`,
    'sharer',
    'toolbar=0,status=0,width=626,height=436',
  );
};
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Шапка профиля */
.profile-header {
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.2), rgba(255, 107, 107, 0.2));
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-wrap: wrap;
}

.avatar-large {
  position: relative;
  width: 120px;
  height: 120px;
}

.avatar-large img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid #ffd166;
  object-fit: cover;
}

.level-badge-large {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: white;
  border: 2px solid white;
}

.user-info h1 {
  font-size: 28px;
  color: white;
  margin-bottom: 8px;
}

.user-email {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 12px;
}

.user-stats-badge {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.user-stats-badge span {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
  font-size: 36px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #ffd166;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* Секции */
.section-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.section-header h2 {
  font-size: 20px;
  color: white;
}

.section-total,
.activity-badge,
.view-all {
  background: rgba(255, 209, 102, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: #ffd166;
}

.view-all {
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-all:hover {
  background: rgba(255, 209, 102, 0.3);
}

/* Прогресс модулей */
.modules-progress {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module-progress-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-name {
  flex: 1;
  color: white;
  font-weight: 500;
}

.module-percent {
  color: #ffd166;
  font-weight: bold;
  font-size: 14px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd166, #ff6b6b);
  border-radius: 4px;
  transition: width 0.3s ease;
}

/* Достижения */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  gap: 15px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.achievement-card.unlocked {
  background: rgba(107, 203, 119, 0.1);
  border-color: rgba(107, 203, 119, 0.3);
}

.achievement-card.empty {
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.achievement-card.locked {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.7;
}

.achievement-icon {
  font-size: 32px;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  color: white;
  font-size: 16px;
  margin-bottom: 4px;
}

.achievement-info p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-bottom: 8px;
}

.achievement-date,
.achievement-locked {
  font-size: 10px;
  color: #6bcb77;
}

.achievement-locked {
  color: rgba(255, 255, 255, 0.4);
}

/* Активность */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.activity-stat {
  text-align: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
}

.activity-value {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #ffd166;
  margin-bottom: 5px;
}

.activity-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

/* Кнопки действий */
.actions-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.share-btn {
  background: #4c75a3;
  color: white;
  padding: 12px 28px;
  border: none;
  border-radius: 40px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: #3a5a80;
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-page {
    padding: 15px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .activity-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .user-stats-badge {
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .actions-card {
    flex-direction: column;
  }

  .share-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
