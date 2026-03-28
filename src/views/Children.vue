<!-- views/Children.vue -->
<template>
  <div class="children-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-emoji">👨‍👩‍👧</span>
        Мои дети
        <span class="title-emoji">🎓</span>
      </h1>
      <p class="page-subtitle">Отслеживай прогресс своих детей и помогай им в обучении!</p>
    </div>

    <!-- Кнопка для создания реферальной ссылки -->
    <div class="referral-section">
      <button
        class="referral-btn"
        @click="generateReferralLink"
      >
        🔗 Создать ссылку для регистрации ребенка
      </button>
      <div
        v-if="referralLink"
        class="referral-link-container"
      >
        <div class="referral-link">
          <input
            type="text"
            :value="referralLink"
            readonly
            ref="linkInput"
          />
          <button
            class="copy-btn"
            @click="copyToClipboard"
          >
            📋 Копировать
          </button>
        </div>
        <p class="referral-hint">
          Отправь эту ссылку ребенку. При регистрации он автоматически будет привязан к твоему
          аккаунту!
        </p>
      </div>
    </div>

    <!-- Список детей -->
    <div
      class="children-container"
      v-if="children.length > 0"
    >
      <div
        v-for="child in children"
        :key="child.id"
        class="child-card"
      >
        <div class="child-header">
          <div class="child-avatar">
            {{ child.username.charAt(0).toUpperCase() }}
          </div>
          <div class="child-info">
            <h2>{{ child.username }}</h2>
            <p class="child-email">{{ child.email }}</p>
            <div class="child-stats-badge">
              <span>📅 Регистрация: {{ formatDate(child.created_at) }}</span>
            </div>
          </div>
        </div>

        <div class="child-stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⭐</div>
            <div class="stat-info">
              <span class="stat-value">{{ child.exp }}</span>
              <span class="stat-label">Всего XP</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <span class="stat-value">{{ getLevelByExp(child.exp) }}</span>
              <span class="stat-label">Уровень</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <span class="stat-value">{{ getXPToNextLevel(child.exp) }}</span>
              <span class="stat-label">До след. уровня</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-info">
              <span class="stat-value">{{ getProgressPercent(child.exp) }}%</span>
              <span class="stat-label">Прогресс</span>
            </div>
          </div>
        </div>

        <div class="progress-section">
          <div class="progress-label">
            <span>Прогресс до следующего уровня</span>
            <span>{{ getProgressPercent(child.exp) }}%</span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: getProgressPercent(child.exp) + '%' }"
            ></div>
          </div>
        </div>

        <div class="child-achievements">
          <h3>🏅 Достижения</h3>
          <div class="achievements-list">
            <div
              v-for="ach in getChildAchievements(child)"
              :key="ach.id"
              class="achievement-tag"
            >
              {{ ach.icon }} {{ ach.title }}
            </div>
            <div
              v-if="getChildAchievements(child).length === 0"
              class="no-achievements"
            >
              Пока нет достижений
            </div>
          </div>
        </div>

        <div class="child-actions">
          <button
            class="view-progress-btn"
            @click="viewChildProgress(child)"
          >
            📊 Подробная статистика
          </button>
          <button
            class="share-btn"
            @click="shareChildProgress(child)"
          >
            📱 Поделиться успехами
          </button>
        </div>
      </div>
    </div>

    <div
      v-else-if="!loading"
      class="empty-state"
    >
      <div class="empty-icon">👶</div>
      <h3>У вас пока нет детей</h3>
      <p>Создайте реферальную ссылку и отправьте её ребенку для регистрации</p>
    </div>

    <div
      v-if="loading"
      class="loading-state"
    >
      <div class="spinner"></div>
      <p>Загрузка данных...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '@/services/authService';
import { usersService } from '@/services/usersService';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const children = ref<User[]>([]);
const loading = ref(true);
const referralLink = ref('');

const getLevelByExp = (exp: number): number => {
  return Math.floor(exp / 1000) + 1;
};

const getXPToNextLevel = (exp: number): number => {
  const nextLevelXP = (Math.floor(exp / 1000) + 1) * 1000;
  return nextLevelXP - exp;
};

const getProgressPercent = (exp: number): number => {
  const currentLevel = Math.floor(exp / 1000);
  const currentLevelXP = currentLevel * 1000;
  const nextLevelXP = (currentLevel + 1) * 1000;
  return ((exp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
};

const getChildAchievements = (child: User): any[] => {
  const allAchievements = [
    { id: 1, title: 'Первая переменная', icon: '📦', requiredExp: 0 },
    { id: 2, title: 'Король циклов', icon: '🔄', requiredExp: 500 },
    { id: 3, title: 'Мастер условий', icon: '🤔', requiredExp: 1000 },
    { id: 4, title: 'Победитель бота', icon: '🎮', requiredExp: 1500 },
    { id: 5, title: 'Социальный кодер', icon: '💬', requiredExp: 2000 },
  ];

  return allAchievements.filter((ach) => child.exp >= ach.requiredExp);
};

const generateReferralLink = () => {
  const parentId = authStore.user?.id;
  if (!parentId) return;

  const baseUrl = window.location.origin;
  referralLink.value = `${baseUrl}/register?parent_id=${parentId}`;
};

const copyToClipboard = () => {
  if (referralLink.value) {
    navigator.clipboard.writeText(referralLink.value);
    alert('Ссылка скопирована в буфер обмена!');
  }
};

const viewChildProgress = (child: User) => {
  alert(`Подробная статистика для ${child.username} будет доступна позже`);
};

const shareChildProgress = (child: User) => {
  const shareText = `Мой ребенок ${child.username} изучает программирование в CodeCraft! 🎮\n\n📊 Статистика:\n• Уровень: ${getLevelByExp(child.exp)}\n• XP: ${child.exp}\n• Прогресс: ${getProgressPercent(child.exp)}%\n\nПрисоединяйтесь к нам! 🚀`;

  const shareUrl = encodeURIComponent(window.location.origin);
  const shareTitle = encodeURIComponent(`Успехи ${child.username} в CodeCraft`);
  const shareDescription = encodeURIComponent(shareText);

  window.open(
    `https://vk.com/share.php?url=${shareUrl}&title=${shareTitle}&description=${shareDescription}&noparse=true`,
    'sharer',
    'toolbar=0,status=0,width=626,height=436',
  );
};

const fetchChildren = async () => {
  loading.value = true;
  try {
    const data = await usersService.getChildren();
    children.value = data.sort((a, b) => b.exp - a.exp);
  } catch (error) {
    console.error('Ошибка загрузки детей:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchChildren();
});
</script>

<style scoped>
/* Добавляем стили для реферальной секции */
.referral-section {
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.2), rgba(255, 107, 107, 0.2));
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 25px;
  margin-bottom: 30px;
  text-align: center;
}

.referral-btn {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  padding: 12px 28px;
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.referral-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.referral-link-container {
  margin-top: 20px;
  animation: slideDown 0.3s ease;
}

.referral-link {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}

.referral-link input {
  flex: 1;
  min-width: 250px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #ffd166;
  border-radius: 50px;
  font-size: 14px;
  color: #5a3e2b;
  text-align: center;
}

.copy-btn {
  background: #4c75a3;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: #3a5a80;
  transform: scale(1.05);
}

.referral-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Остальные стили остаются без изменений */
.children-page {
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

.children-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.child-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 25px;
  transition: transform 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.child-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.child-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.child-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 32px;
  color: white;
  border: 3px solid white;
}

.child-info h2 {
  font-size: 24px;
  color: white;
  margin-bottom: 5px;
}

.child-email {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.child-stats-badge {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.child-stats-badge span {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
}

.child-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-icon {
  font-size: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #ffd166;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.progress-section {
  margin-bottom: 20px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  color: white;
  font-size: 13px;
  margin-bottom: 8px;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd166, #ff6b6b);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.child-achievements {
  margin-bottom: 20px;
}

.child-achievements h3 {
  color: white;
  font-size: 16px;
  margin-bottom: 12px;
}

.achievements-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.achievement-tag {
  background: rgba(107, 203, 119, 0.2);
  border: 1px solid #6bcb77;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 12px;
  color: #6bcb77;
}

.no-achievements {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  padding: 10px;
  text-align: center;
}

.child-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.view-progress-btn,
.share-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-progress-btn {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  color: white;
}

.share-btn {
  background: #4c75a3;
  color: white;
}

.view-progress-btn:hover,
.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.empty-state,
.loading-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
}

.loading-state p {
  color: white;
  margin-top: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffd166;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .children-page {
    padding: 15px;
  }

  .child-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .child-header {
    flex-direction: column;
    text-align: center;
  }

  .child-avatar {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .child-info h2 {
    font-size: 20px;
  }

  .child-actions {
    flex-direction: column;
  }

  .view-progress-btn,
  .share-btn {
    width: 100%;
    justify-content: center;
  }

  .referral-link {
    flex-direction: column;
  }

  .referral-link input {
    width: 100%;
  }
}
</style>
