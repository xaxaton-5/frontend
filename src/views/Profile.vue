<!-- views/Profile.vue -->
<template>
  <div class="profile-page">
    <div class="profile-container">
      <!-- Шапка профиля -->
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-large">
            <div class="avatar-placeholder">
              {{ userInitial }}
            </div>
            <div class="level-badge-large">{{ userStatsStore.stats.level }}</div>
          </div>
          <div class="user-info">
            <h1>{{ user?.username }}</h1>
            <p class="user-email">{{ user?.email }}</p>
            <p
              v-if="user?.guild_name"
              class="guild-name"
            >
              🛡️ {{ user.guild_name }}
            </p>
            <div class="user-stats-badge">
              <span>📅 Регистрация: {{ formattedDate }}</span>
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
      <!-- Активность -->
      <div class="section-card">
        <div class="section-header">
          <h2>📊 Активность</h2>
          <span class="activity-badge">За последние 7 дней</span>
        </div>

        <!-- Стрик в виде звездочек -->
        <div class="streak-container">
          <div class="streak-title">
            <span class="streak-icon">🔥</span>
            <span class="streak-count">{{ userStatsStore.stats.dailyStreak }} дней подряд!</span>
          </div>
          <div class="streak-stars">
            <div
              v-for="day in 7"
              :key="day"
              class="streak-star"
              :class="{
                active: day <= userStatsStore.stats.dailyStreak,
                inactive: day > userStatsStore.stats.dailyStreak,
              }"
            >
              <span class="star-icon">{{
                day <= userStatsStore.stats.dailyStreak ? '⭐' : '☆'
              }}</span>
              <span class="star-day">{{ getDayName(day) }}</span>
            </div>
          </div>
        </div>

        <div class="activity-grid">
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
import { getTotalProgress } from '@/data/modules';
import type { User } from '@/services/authService';
import { usersService } from '@/services/usersService';
import { useAuthStore } from '@/stores/authStore';
import { useModulesStore } from '@/stores/modulesStore';
import { useUserStatsStore } from '@/stores/userStatsStore';

const authStore = useAuthStore();
const userStatsStore = useUserStatsStore();
const modulesStore = useModulesStore();
const user = computed(() => authStore.user);

const allUsers = ref<User[]>([]);
const userRank = ref(0);

// Используем данные из modulesStore, а не из импортированного modules
const totalProgress = computed(() => modulesStore.totalProgress);

const formattedDate = computed(() => {
  if (!user.value?.date_joined) return '—';
  const date = new Date(user.value.date_joined);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
});

// Прогресс по модулям - берем из modulesStore
const modulesProgress = computed(() => {
  return modulesStore.modules.map((m) => ({
    id: m.id,
    title: m.title,
    progress: m.progress,
  }));
});

const userInitial = computed(() => {
  return user.value?.username?.charAt(0).toUpperCase() || '?';
});

const fetchUsersAndRank = async () => {
  try {
    const data = await usersService.getUsers();
    const sortedUsers = [...data].filter((user) => !user.is_parent).sort((a, b) => b.exp - a.exp);
    allUsers.value = sortedUsers;

    const currentUserId = authStore.user?.id;
    if (currentUserId) {
      const rankIndex = sortedUsers.findIndex((u) => u.id === currentUserId);
      userRank.value = rankIndex !== -1 ? rankIndex + 1 : 0;
    }
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  }
};

const getDayName = (day: number): string => {
  const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  const today = new Date().getDay(); // 0 - воскресенье, 1 - понедельник, ...
  // Преобразуем воскресенье в индекс 6 для нашего массива
  const todayIndex = today === 0 ? 6 : today - 1;

  // Вычисляем индекс для каждого дня (1-7)
  let targetIndex = (todayIndex - (7 - day)) % 7;
  if (targetIndex < 0) targetIndex += 7;

  return days[targetIndex];
};

const shareToVK = () => {
  const shareText = `Я изучаю программирование в CodeCraft! 🎮\n\n📊 Моя статистика:\n• Уровень: ${userStatsStore.userLevel}\n• XP: ${userStatsStore.stats.totalXp}\n• Уроков пройдено: ${userStatsStore.stats.completedLessons}/${userStatsStore.totalLessons}\n• Игр пройдено: ${userStatsStore.completedGamesCount}/${userStatsStore.totalGames}\n• Достижений: ${userStatsStore.unlockedAchievementsCount}/${userStatsStore.totalAchievements}\n\nПрисоединяйся ко мне! 🚀`;

  const shareUrl = encodeURIComponent(window.location.origin);
  const shareTitle = encodeURIComponent('CodeCraft - Изучай программирование играя!');
  const shareDescription = encodeURIComponent(shareText);

  window.open(
    `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}&description=${shareDescription}&noparse=true`,
    'sharer',
    'toolbar=0,status=0,width=626,height=436',
  );
};

onMounted(() => {
  fetchUsersAndRank();
});
</script>

<style scoped>
/* Стили остаются без изменений */
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

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 48px;
  color: white;
  border: 4px solid white;
}

.avatar-large {
  position: relative;
  width: 120px;
  height: 120px;
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
  margin-bottom: 8px;
}

.guild-name {
  color: #ffd166;
  font-weight: 700;
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

/* Стрик */
.streak-container {
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.15), rgba(255, 107, 107, 0.15));
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  text-align: center;
}

.streak-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.streak-icon {
  font-size: 28px;
  animation: flameFlicker 1s infinite;
}

.streak-count {
  font-size: 20px;
  font-weight: bold;
  color: #ffd166;
  text-shadow: 0 0 10px rgba(255, 209, 102, 0.5);
}

.streak-stars {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.streak-star {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.streak-star.active {
  animation: starPop 0.5s ease;
}

.star-icon {
  font-size: 32px;
  transition: all 0.3s ease;
}

.streak-star.active .star-icon {
  text-shadow: 0 0 10px #ffd166;
  transform: scale(1.1);
}

.streak-star.inactive .star-icon {
  opacity: 0.4;
  filter: grayscale(0.3);
}

.star-day {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.streak-star.active .star-day {
  color: #ffd166;
}

@keyframes flameFlicker {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

@keyframes starPop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Обновляем activity-grid, убираем лишний элемент */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
