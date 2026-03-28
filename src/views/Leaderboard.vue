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
    <div style="text-align: center">
      <div class="mascot-container">
        <img
          :src="mascotImage"
          alt="Робот-маскот"
          class="mascot-image"
        />
        <div class="speech-bubble">Ты тоже можешь стать звездочкой!</div>
      </div>
    </div>

    <!-- Топ-3 игрока -->
    <div class="top-three">
      <div
        class="top-card second"
        v-if="topPlayers[1]"
      >
        <div class="medal silver">🥈</div>
        <div class="player-avatar-placeholder top-avatar">
          {{ topPlayers[1].username.charAt(0).toUpperCase() }}
        </div>
        <h3>{{ topPlayers[1].username }}</h3>
        <p
          v-if="topPlayers[1].guild_name"
          class="player-guild"
        >
          🛡️ {{ topPlayers[1].guild_name }}
        </p>
        <p>Уровень {{ getLevelByExp(topPlayers[1].exp) }}</p>
        <div class="stats">
          <span>🏆 {{ topPlayers[1].exp }} XP</span>
        </div>
      </div>

      <div
        class="top-card first"
        v-if="topPlayers[0]"
      >
        <div class="medal gold">👑</div>
        <div class="player-avatar-placeholder top-avatar">
          {{ topPlayers[0].username.charAt(0).toUpperCase() }}
        </div>
        <h3>{{ topPlayers[0].username }}</h3>
        <p
          v-if="topPlayers[0].guild_name"
          class="player-guild"
        >
          🛡️ {{ topPlayers[0].guild_name }}
        </p>
        <p>Уровень {{ getLevelByExp(topPlayers[0].exp) }}</p>
        <div class="stats">
          <span>🏆 {{ topPlayers[0].exp }} XP</span>
        </div>
      </div>

      <div
        class="top-card third"
        v-if="topPlayers[2]"
      >
        <div class="medal bronze">🥉</div>
        <div class="player-avatar-placeholder top-avatar">
          {{ topPlayers[2].username.charAt(0).toUpperCase() }}
        </div>
        <h3>{{ topPlayers[2].username }}</h3>
        <p
          v-if="topPlayers[2].guild_name"
          class="player-guild"
        >
          🛡️ {{ topPlayers[2].guild_name }}
        </p>
        <p>Уровень {{ getLevelByExp(topPlayers[2].exp) }}</p>
        <div class="stats">
          <span>🏆 {{ topPlayers[2].exp }} XP</span>
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
        v-for="(player, index) in players"
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
          <div class="player-avatar-placeholder">
            {{ player.username.charAt(0).toUpperCase() }}
          </div>
          <div class="player-meta">
            <span class="player-name">{{ player.username }}</span>
            <span
              v-if="player.guild_name"
              class="guild-badge"
            >
              🛡️ {{ player.guild_name }}
            </span>
          </div>
          <span
            v-if="player.id === currentUserId"
            class="you-badge"
            >Ты</span
          >
          <span
            v-if="player.is_parent"
            class="parent-badge"
            >👪 Родитель</span
          >
        </div>
        <div class="level">
          <div class="level-badge-small"><span>🏆</span> {{ getLevelByExp(player.exp) }}</div>
        </div>
        <div class="xp">
          <div class="xp-bar-small">
            <div
              class="xp-fill-small"
              :style="{ width: getXPPercent(player) + '%' }"
            ></div>
          </div>
          <span>{{ player.exp }} XP</span>
        </div>
        <div class="achievements">
          <div class="achievement-icons">
            <span
              v-for="(ach, idx) in getMockAchievements(player)"
              :key="idx"
              class="achievement-icon"
              :title="ach"
            >
              {{ getAchievementIcon(ach) }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="players.length === 0 && !loading"
        class="table-row empty"
      >
        <div class="rank">—</div>
        <div class="player">Нет пользователей</div>
        <div class="level">—</div>
        <div class="xp">—</div>
        <div class="achievements">—</div>
      </div>

      <div
        v-if="loading"
        class="table-row empty"
      >
        <div class="rank">—</div>
        <div class="player">Загрузка...</div>
        <div class="level">—</div>
        <div class="xp">—</div>
        <div class="achievements">—</div>
      </div>
    </div>

    <!-- Статистика пользователя -->
    <div
      class="user-stats-card"
      v-if="currentUser && !currentUser.is_parent""
    >
      <div class="stats-header">
        <div class="player-avatar-placeholder large">
          {{ currentUser.username.charAt(0).toUpperCase() }}
        </div>
        <div>
          <h3>{{ currentUser.username }}</h3>
          <p
            v-if="currentUser.guild_name"
            class="player-guild"
          >
            🛡️ {{ currentUser.guild_name }}
          </p>
          <p>Твоя позиция: #{{ currentUserRank }}</p>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ currentUser.exp }}</span>
          <span class="stat-label">Всего XP</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ getLevelByExp(currentUser.exp) }}</span>
          <span class="stat-label">Уровень</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ getMockAchievements(currentUser).length }}</span>
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
import { ref, computed, onMounted } from 'vue';
import mascotImage from '@/assets/images/3.png';
import type { User } from '@/services/authService';
import { usersService } from '@/services/usersService';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const players = ref<User[]>([]);
const loading = ref(true);

// Текущий пользователь из authStore
const currentUser = computed(() => authStore.user);

const currentUserId = computed(() => currentUser.value?.id);

const topPlayers = computed(() => {
  return players.value.slice(0, 3);
});

const currentUserRank = computed(() => {
  if (!currentUserId.value) return '?';
  const index = players.value.findIndex((p) => p.id === currentUserId.value);
  return index !== -1 ? index + 1 : '?';
});

const completedLessons = ref(12);

const getLevelByExp = (exp: number): number => {
  return Math.floor(exp / 1000) + 1;
};

const getXPPercent = (player: User): number => {
  const level = getLevelByExp(player.exp);
  const currentLevelXP = (level - 1) * 1000;
  const nextLevelXP = level * 1000;
  return ((player.exp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
};

const getMockAchievements = (player: User): string[] => {
  const allAchievements = [
    'Первая переменная',
    'Король циклов',
    'Мастер условий',
    'Победитель бота',
    'Социальный кодер',
  ];
  const count = Math.min(Math.floor(player.exp / 500) + 1, allAchievements.length);
  return allAchievements.slice(0, count);
};

const getAchievementIcon = (achievement: string): string => {
  const icons: Record<string, string> = {
    'Первая переменная': '📦',
    'Король циклов': '🔄',
    'Мастер условий': '🤔',
    'Победитель бота': '🎮',
    'Социальный кодер': '💬',
  };
  return icons[achievement] || '🏅';
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const data = await usersService.getUsers();
    players.value = data.filter((user) => !user.is_parent).sort((a, b) => b.exp - a.exp);
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
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

.title-emoji {
  font-size: 54px;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
}

/* Топ-3 */
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
  min-width: 150px;
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
  width: 80px;
  height: 80px;
  margin: 15px auto;
  font-size: 32px;
}

.top-card h3 {
  color: white;
  margin-bottom: 5px;
}

.top-card p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.player-guild {
  color: #ffd166 !important;
  font-weight: 700;
  margin-bottom: 8px;
}

.top-card .stats {
  color: #ffd166;
  font-weight: bold;
}

/* Таблица */
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

.table-row.empty {
  justify-content: center;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
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
  flex-wrap: wrap;
}

.player-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.player-avatar-placeholder {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
  color: white;
}

.player-avatar-placeholder.large {
  width: 80px;
  height: 80px;
  font-size: 32px;
}

.player-avatar-placeholder.top-avatar {
  width: 80px;
  height: 80px;
  font-size: 32px;
  margin: 0 auto;
}

.player-name {
  color: white;
  font-weight: bold;
}

.guild-badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255, 209, 102, 0.18);
  color: #ffd166;
  font-size: 11px;
  font-weight: 700;
}

.you-badge {
  background: #ffd166;
  color: #5a3e2b;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.parent-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #ffd166;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 11px;
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
  flex-wrap: wrap;
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
  .leaderboard-page {
    padding: 15px;
  }

  .top-three {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .top-card.first {
    order: 1;
    transform: scale(1);
  }

  .top-card.second,
  .top-card.third {
    transform: scale(1);
  }

  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 80px 100px 80px;
    font-size: 12px;
    gap: 10px;
  }

  .player-avatar-placeholder {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .achievement-icon {
    font-size: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .you-badge,
  .parent-badge {
    font-size: 10px;
    padding: 2px 6px;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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
