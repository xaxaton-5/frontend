<!-- views/Leaderboard.vue -->
<template>
  <div class="leaderboard-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-emoji">🏆</span>
        Таблица лидеров
        <span class="title-emoji">⭐</span>
      </h1>
      <p class="page-subtitle">Соревнуйся с лучшими кодерами и поднимайся в рейтинге!</p>
    </div>

    <!-- Переключение категорий -->
    <div class="category-tabs">
      <button
        v-for="cat in categories"
        :key="cat.id"
        :class="{ active: currentCategory === cat.id }"
        @click="currentCategory = cat.id"
      >
        <span class="cat-emoji">{{ cat.emoji }}</span>
        {{ cat.name }}
      </button>
    </div>

    <!-- Топ-3 игрока -->
    <div class="top-three">
      <div
        class="top-card second"
        v-if="topPlayers[1]"
      >
        <div class="medal silver">🥈</div>
        <img
          :src="topPlayers[1].avatar"
          alt="Avatar"
          class="top-avatar"
        />
        <h3>{{ topPlayers[1].username }}</h3>
        <p>Уровень {{ topPlayers[1].level }}</p>
        <div class="stats">
          <span>🏆 {{ topPlayers[1].xp }} XP</span>
        </div>
      </div>

      <div
        class="top-card first"
        v-if="topPlayers[0]"
      >
        <div class="medal gold">👑</div>
        <img
          :src="topPlayers[0].avatar"
          alt="Avatar"
          class="top-avatar"
        />
        <h3>{{ topPlayers[0].username }}</h3>
        <p>Уровень {{ topPlayers[0].level }}</p>
        <div class="stats">
          <span>🏆 {{ topPlayers[0].xp }} XP</span>
        </div>
      </div>

      <div
        class="top-card third"
        v-if="topPlayers[2]"
      >
        <div class="medal bronze">🥉</div>
        <img
          :src="topPlayers[2].avatar"
          alt="Avatar"
          class="top-avatar"
        />
        <h3>{{ topPlayers[2].username }}</h3>
        <p>Уровень {{ topPlayers[2].level }}</p>
        <div class="stats">
          <span>🏆 {{ topPlayers[2].xp }} XP</span>
        </div>
      </div>
    </div>

    <!-- Полная таблица рейтинга -->
    <div class="ranking-table">
      <div class="table-header">
        <div class="rank">#</div>
        <div class="player">Игрок</div>
        <div class="level">Уровень</div>
        <div class="xp">Опыт</div>
        <div class="achievements">Достижения</div>
      </div>

      <div
        v-for="(player, index) in filteredPlayers"
        :key="player.id"
        class="table-row"
        :class="{ 'current-user': player.id === currentUserId }"
      >
        <div class="rank">
          <span
            v-if="index === 0"
            class="rank-medal gold"
            >🥇</span
          >
          <span
            v-else-if="index === 1"
            class="rank-medal silver"
            >🥈</span
          >
          <span
            v-else-if="index === 2"
            class="rank-medal bronze"
            >🥉</span
          >
          <span
            v-else
            class="rank-number"
            >{{ index + 1 }}</span
          >
        </div>
        <div class="player">
          <img
            :src="player.avatar"
            alt="Avatar"
            class="player-avatar"
          />
          <span class="player-name">{{ player.username }}</span>
          <span
            v-if="player.id === currentUserId"
            class="you-badge"
            >Ты</span
          >
        </div>
        <div class="level">
          <div class="level-badge-small"><span>🏆</span> {{ player.level }}</div>
        </div>
        <div class="xp">
          <div class="xp-bar-small">
            <div
              class="xp-fill-small"
              :style="{ width: getXPPercent(player) + '%' }"
            ></div>
          </div>
          <span>{{ player.xp }} XP</span>
        </div>
        <div class="achievements">
          <div class="achievement-icons">
            <span
              v-for="ach in player.achievements"
              :key="ach"
              class="achievement-icon"
              :title="ach"
            >
              {{ getAchievementIcon(ach) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Статистика пользователя -->
    <div
      class="user-stats-card"
      v-if="currentUser"
    >
      <div class="stats-header">
        <img
          :src="currentUser.avatar"
          alt="Avatar"
        />
        <div>
          <h3>{{ currentUser.username }}</h3>
          <p>Твоя позиция: #{{ currentUserRank }}</p>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ currentUser.xp }}</span>
          <span class="stat-label">Всего XP</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ currentUser.level }}</span>
          <span class="stat-label">Уровень</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ currentUser.achievements?.length || 0 }}</span>
          <span class="stat-label">Достижений</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ completedLessons }}</span>
          <span class="stat-label">Пройдено уроков</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const currentCategory = ref('all');

const categories = [
  { id: 'all', name: 'Все', emoji: '🌍' },
  { id: 'week', name: 'За неделю', emoji: '📅' },
  { id: 'month', name: 'За месяц', emoji: '📆' },
  { id: 'friends', name: 'Друзья', emoji: '👥' },
];

const players = ref([
  {
    id: 1,
    username: 'КодоМастер',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
    level: 15,
    xp: 15200,
    achievements: ['Первая переменная', 'Король циклов', 'Мастер функций'],
  },
  {
    id: 2,
    username: 'ХакерКот',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HackerCat',
    level: 12,
    xp: 11800,
    achievements: ['Первая переменная', 'Король циклов'],
  },
  {
    id: 3,
    username: 'ПиксельПанда',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelPanda',
    level: 10,
    xp: 9500,
    achievements: ['Первая переменная', 'Король циклов'],
  },
  {
    id: 4,
    username: 'БайтБоец',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ByteFighter',
    level: 8,
    xp: 7200,
    achievements: ['Первая переменная'],
  },
  {
    id: 5,
    username: 'Алгоритмик',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Algorithmic',
    level: 7,
    xp: 6800,
    achievements: ['Первая переменная'],
  },
]);

const currentUserId = computed(() => authStore.user?.id);
const currentUser = computed(() => authStore.user);

const topPlayers = computed(() => {
  return players.value.slice(0, 3);
});

const filteredPlayers = computed(() => {
  if (currentCategory.value === 'friends') {
    // В реальном приложении здесь была бы фильтрация по друзьям
    return players.value.filter((p) => p.id === currentUserId.value || Math.random() > 0.5);
  }
  return players.value;
});

const currentUserRank = computed(() => {
  const index = filteredPlayers.value.findIndex((p) => p.id === currentUserId.value);
  return index !== -1 ? index + 1 : '?';
});

const completedLessons = computed(() => {
  // В реальном приложении брать из стора
  return 12;
});

const getXPPercent = (player: any) => {
  const currentLevelXP = (player.level - 1) * 1000;
  const nextLevelXP = player.level * 1000;
  return ((player.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
};

const getAchievementIcon = (achievement: string) => {
  const icons: Record<string, string> = {
    'Первая переменная': '📦',
    'Король циклов': '🔄',
    'Мастер функций': '⚡',
  };
  return icons[achievement] || '🏅';
};
</script>

<style scoped>
.leaderboard-page {
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

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
}

.category-tabs {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
}

.category-tabs button {
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
}

.category-tabs button.active {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  transform: scale(1.05);
}

.cat-emoji {
  font-size: 20px;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 50px;
}

.top-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 20px;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
}

.top-card.first {
  transform: scale(1.1);
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.3), rgba(255, 107, 107, 0.3));
}

.top-card.second,
.top-card.third {
  transform: scale(0.95);
}

.medal {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
}

.top-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #ffd166;
  margin-bottom: 15px;
}

.top-card h3 {
  color: white;
  margin-bottom: 5px;
}

.top-card p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.stats {
  color: #ffd166;
  font-weight: bold;
}

.ranking-table {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  overflow: hidden;
  margin-bottom: 30px;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px 150px 120px;
  padding: 15px 20px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-weight: bold;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 100px 150px 120px;
  padding: 15px 20px;
  align-items: center;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-row:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.table-row.current-user {
  background: linear-gradient(90deg, rgba(255, 209, 102, 0.2), transparent);
  border-left: 4px solid #ffd166;
}

.rank {
  font-weight: bold;
  font-size: 18px;
}

.rank-medal {
  font-size: 24px;
}

.rank-number {
  color: white;
}

.player {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ffd166;
}

.player-name {
  color: white;
  font-weight: bold;
}

.you-badge {
  background: #ffd166;
  color: #5a3e2b;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.level-badge-small {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: white;
}

.xp {
  display: flex;
  align-items: center;
  gap: 10px;
}

.xp-bar-small {
  width: 80px;
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.xp-fill-small {
  height: 100%;
  background: linear-gradient(90deg, #ffd166, #ff6b6b);
  transition: width 0.3s ease;
}

.xp span {
  color: white;
  font-size: 12px;
}

.achievement-icons {
  display: flex;
  gap: 5px;
}

.achievement-icon {
  font-size: 20px;
  cursor: help;
}

.user-stats-card {
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.2), rgba(255, 107, 107, 0.2));
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 20px;
}

.stats-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.stats-header img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #ffd166;
}

.stats-header h3 {
  color: white;
  font-size: 24px;
  margin-bottom: 5px;
}

.stats-header p {
  color: #ffd166;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #ffd166;
}

.stat-label {
  color: white;
  font-size: 12px;
}

@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 80px 100px 80px;
    font-size: 12px;
    gap: 10px;
  }

  .top-three {
    flex-direction: column;
    align-items: center;
  }

  .top-card.first {
    order: 1;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
