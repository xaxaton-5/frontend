<template>
  <div class="profile-page">
    <div
      v-if="isLoading"
      class="state-card"
    >
      <div class="spinner"></div>
      <p>Загружаем профиль участника...</p>
    </div>

    <div
      v-else-if="profileUser"
      class="profile-container"
    >
      <div class="profile-header">
        <div class="avatar-section">
          <div class="avatar-large">
            <div class="avatar-placeholder">
              {{ userInitial }}
            </div>
            <div class="level-badge-large">{{ userLevel }}</div>
          </div>
          <div class="user-info">
            <h1>{{ profileUser.username }}</h1>
            <p class="user-email">{{ profileUser.is_parent ? 'Родитель' : 'Участник сообщества' }}</p>
            <div class="user-stats-badge">
              <span>📅 Регистрация: {{ formattedDate }}</span>
              <span v-if="userRank > 0">🏆 Рейтинг: #{{ userRank }}</span>
              <span>{{ profileUser.is_parent ? '👨‍👩‍👧 Аккаунт родителя' : '🎮 Детский аккаунт' }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <span class="stat-value">{{ profileUser.exp }}</span>
            <span class="stat-label">Всего XP</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏅</div>
          <div class="stat-info">
            <span class="stat-value">{{ userLevel }}</span>
            <span class="stat-label">Уровень</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👨‍👩‍👧</div>
          <div class="stat-info">
            <span class="stat-value">{{ profileUser.children_count }}</span>
            <span class="stat-label">Детей привязано</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🆔</div>
          <div class="stat-info">
            <span class="stat-value">#{{ profileUser.id }}</span>
            <span class="stat-label">ID участника</span>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="section-header">
          <h2>📌 О профиле</h2>
        </div>
        <div class="about-grid">
          <div class="about-item">
            <span class="about-label">Имя</span>
            <span class="about-value">{{ profileUser.username }}</span>
          </div>
          <div class="about-item">
            <span class="about-label">Тип аккаунта</span>
            <span class="about-value">{{ profileUser.is_parent ? 'Родитель' : 'Ученик' }}</span>
          </div>
          <div class="about-item">
            <span class="about-label">Дата регистрации</span>
            <span class="about-value">{{ formattedDate }}</span>
          </div>
          <div class="about-item">
            <span class="about-label">Позиция в рейтинге</span>
            <span class="about-value">{{ userRank > 0 ? `#${userRank}` : 'Не участвует' }}</span>
          </div>
        </div>
      </div>

      <div class="actions-card">
        <RouterLink
          v-if="isCurrentUser"
          to="/profile"
          class="action-btn"
        >
          Открыть мой полный профиль
        </RouterLink>
        <RouterLink
          v-else
          to="/community/chat"
          class="action-btn secondary"
        >
          Вернуться в чат
        </RouterLink>
      </div>
    </div>

    <div
      v-else
      class="state-card"
    >
      <p>Профиль участника не найден.</p>
      <RouterLink
        to="/community/chat"
        class="action-btn secondary"
      >
        Назад в чат
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { User } from '@/services/authService';
import { usersService } from '@/services/usersService';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

const isLoading = ref(false);
const profileUser = ref<User | null>(null);
const userRank = ref(0);

const routeUserId = computed(() => Number(route.params.id));
const isCurrentUser = computed(() => authStore.user?.id === profileUser.value?.id);
const userInitial = computed(() => profileUser.value?.username?.charAt(0).toUpperCase() || '?');
const userLevel = computed(() => Math.floor((profileUser.value?.exp || 0) / 1000) + 1);

const formattedDate = computed(() => {
  if (!profileUser.value?.date_joined) return '—';
  return new Date(profileUser.value.date_joined).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
});

const loadUserProfile = async () => {
  if (!Number.isFinite(routeUserId.value)) {
    profileUser.value = null;
    userRank.value = 0;
    return;
  }

  isLoading.value = true;

  try {
    const users = await usersService.getUsers();
    profileUser.value = users.find((user) => user.id === routeUserId.value) || null;

    const rankedUsers = [...users].filter((user) => !user.is_parent).sort((a, b) => b.exp - a.exp);
    userRank.value = profileUser.value?.is_parent
      ? 0
      : rankedUsers.findIndex((user) => user.id === profileUser.value?.id) + 1;
  } catch (error) {
    console.error('Ошибка загрузки профиля участника:', error);
    profileUser.value = null;
    userRank.value = 0;
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadUserProfile);
watch(() => route.params.id, loadUserProfile);
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

.profile-header,
.section-card,
.actions-card,
.state-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.profile-header {
  padding: 30px;
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.2), rgba(255, 107, 107, 0.2));
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

.level-badge-large {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
}

.user-info h1 {
  margin-bottom: 8px;
  font-size: 28px;
  color: white;
}

.user-email {
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.75);
}

.user-stats-badge {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.user-stats-badge span {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
  background: rgba(255, 255, 255, 0.2);
}

.stats-grid,
.about-grid {
  display: grid;
  gap: 16px;
}

.stats-grid {
  grid-template-columns: repeat(4, 1fr);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
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

.stat-label,
.about-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.section-card {
  padding: 24px;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  color: white;
}

.about-grid {
  grid-template-columns: repeat(2, 1fr);
}

.about-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
}

.about-value {
  color: white;
  font-weight: 600;
}

.actions-card,
.state-card {
  padding: 24px;
}

.actions-card {
  display: flex;
  justify-content: center;
}

.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: white;
  text-align: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 999px;
  text-decoration: none;
  color: white;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.18);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: #ffd166;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 15px;
  }

  .avatar-section {
    flex-direction: column;
    text-align: center;
  }

  .user-stats-badge {
    justify-content: center;
  }

  .stats-grid,
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
