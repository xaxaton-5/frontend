<!-- App.vue -->
<template>
  <div
    id="app"
    :class="{ 'dark-mode': isDarkMode }"
  >
    <!-- Анимированный фон -->
    <div class="animated-bg">
      <div class="gradient-bg"></div>
      <div class="floating-shapes">
        <div
          v-for="i in 20"
          :key="i"
          class="shape"
          :style="getShapeStyle(i)"
        ></div>
      </div>
    </div>

    <!-- Контент приложения -->
    <div class="app-content">
      <!-- Хедер -->
      <header class="game-header">
        <div
          class="logo"
          @click="goHome"
        >
          <span class="logo-emoji">🎮</span>
          <span class="logo-text">CodeCraft</span>
          <span class="logo-badge">beta</span>
        </div>

        <!-- Навигация для авторизованных пользователей -->
        <div
          v-if="authStore.isAuthenticated"
          class="user-info"
        >
          <div class="stats-container">
            <div class="level-badge">
              <span class="level-icon">🏆</span>
              <span>Ур. {{ userLevel }}</span>
            </div>

            <div class="xp-container">
              <div class="xp-bar">
                <div
                  class="xp-fill"
                  :style="{ width: xpPercentage + '%' }"
                >
                  <div class="xp-glow"></div>
                </div>
                <span class="xp-text">{{ userExp }} / {{ nextLevelXP }} XP</span>
              </div>
            </div>
          </div>

          <div
            class="user-profile"
            @click="showUserMenu = !showUserMenu"
          >
            <div class="avatar-container">
              <div class="avatar-placeholder">
                {{ userInitial }}
              </div>
              <div class="avatar-ring"></div>
            </div>
            <span class="username">{{ user?.username }}</span>
            <span class="dropdown-arrow">▼</span>
          </div>

          <button
            class="logout-btn"
            @click.stop="handleLogout"
            title="Выйти"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <!-- Кнопка входа для неавторизованных -->
        <button
          v-else
          class="login-btn-header"
          @click="showAuthModal = true"
        >
          <span class="btn-icon">🎮</span>
          Войти в игру
        </button>

        <!-- Выпадающее меню пользователя -->
        <transition name="slide-down">
          <div
            v-if="showUserMenu && authStore.isAuthenticated"
            class="user-menu"
            @click.stop
          >
            <div class="menu-header">
              <div class="avatar-placeholder small">
                {{ userInitial }}
              </div>
              <div>
                <h4>{{ user?.username }}</h4>
                <p>{{ user?.email }}</p>
              </div>
            </div>
            <div class="menu-items">
              <button @click="navigateTo('/profile')"><span>📊</span> Мой профиль</button>
              <button @click="navigateTo('/achievements')"><span>🏅</span> Мои достижения</button>
              <!-- Пункт "Мои дети" только для родителей -->
              <button
                v-if="user?.is_parent"
                @click="navigateTo('/children')"
              >
                <span>👨‍👩‍👧</span> Мои дети
              </button>
              <button @click="toggleDarkMode">
                <span>🌓</span> {{ isDarkMode ? 'Светлая тема' : 'Тёмная тема' }}
              </button>
              <button
                @click="handleLogout"
                class="logout-item"
              >
                <span>🚪</span> Выйти из игры
              </button>
            </div>
          </div>
        </transition>
      </header>

      <!-- Навигационные вкладки (только для авторизованных) -->
      <nav
        v-if="authStore.isAuthenticated"
        class="game-nav"
      >
        <button
          v-for="tab in navTabs"
          :key="tab.path"
          :class="{ active: $route.path === tab.path }"
          @click="navigateTo(tab.path)"
        >
          <span class="nav-emoji">{{ tab.emoji }}</span>
          <span class="nav-text">{{ tab.name }}</span>
        </button>
      </nav>

      <!-- Основной контент (показываем только для авторизованных) -->
      <main
        v-if="authStore.isAuthenticated"
        class="main-content"
      >
        <router-view v-slot="{ Component, route }">
          <transition
            :name="route.meta.transition || 'fade'"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Welcome секция для неавторизованных -->
      <div
        v-if="!authStore.isAuthenticated"
        class="welcome-section"
      >
        <div class="hero-section">
          <div class="hero-animation">
            <div class="code-rain">
              <span
                v-for="i in 30"
                :key="i"
                class="code-symbol"
                :style="{ animationDelay: i * 0.2 + 's', left: i * 3.33 + '%' }"
              >
                {{ getRandomCodeSymbol() }}
              </span>
            </div>
            <div class="hero-content">
              <h1
                class="glitch-text"
                data-text="CodeCraft"
              >
                CodeCraft
              </h1>
              <p class="tagline">🎮 Где программирование становится игрой! 🎮</p>
              <div class="features">
                <div class="feature">
                  <span class="feature-emoji">🎯</span>
                  <span>Интерактивные уроки</span>
                </div>
                <div class="feature">
                  <span class="feature-emoji">🎨</span>
                  <span>Визуальный редактор кода</span>
                </div>
                <div class="feature">
                  <span class="feature-emoji">🏆</span>
                  <span>Достижения и награды</span>
                </div>
                <div class="feature">
                  <span class="feature-emoji">👾</span>
                  <span>Игровые механики</span>
                </div>
              </div>
              <button
                class="play-now-btn"
                @click="showAuthModal = true"
              >
                <span class="btn-text">🎮 Начать приключение!</span>
                <span class="btn-glow"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Футер (показываем только для авторизованных) -->
      <footer
        v-if="authStore.isAuthenticated"
        class="game-footer"
      >
        <div
          class="daily-reward"
          :class="{ claimed: dailyRewardClaimed }"
          @click="claimDailyReward"
        >
          <span class="reward-icon">🎁</span>
          <div class="reward-info">
            <span>Ежедневная награда</span>
            <span
              class="reward-cooldown"
              v-if="dailyRewardClaimed"
            >
              ⏰ {{ rewardCooldownText }}
            </span>
            <span
              class="reward-available"
              v-else
            >
              ✨ {{ rewardCooldownText }}
            </span>
          </div>
        </div>
        <div class="online-count">
          <span class="online-dot"></span>
          {{ onlineCount }} игроков онлайн
        </div>
        <div class="footer-links">
          <a
            href="#"
            @click.prevent="showAbout"
            >Помощь</a
          >
          <a
            href="#"
            @click.prevent="showRules"
            >Правила</a
          >
          <a
            href="#"
            @click.prevent="showSupport"
            >Поддержка</a
          >
        </div>
      </footer>
    </div>

    <!-- Модальное окно авторизации -->
    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
      @login-success="handleAuthSuccess"
      @register-success="handleAuthSuccess"
    />

    <!-- Уведомления -->
    <div class="notifications">
      <transition-group name="notification">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <span class="notification-emoji">{{ notification.emoji }}</span>
          <span>{{ notification.message }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AuthModal from '@/components/auth/AuthModal.vue';
import { useAuthStore } from '@/stores/authStore';
import axiosInstance from './api/axiosInstance';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const showAuthModal = ref(false);
const showUserMenu = ref(false);
const isDarkMode = ref(false);
const onlineCount = ref(1234);
const notifications = ref<any[]>([]);

// Ежедневная награда
const dailyRewardClaimed = ref(false);

const user = computed(() => authStore.user);

// Вычисление уровня и XP из exp (опыт)
const userExp = computed(() => user.value?.exp || 0);
const userLevel = computed(() => Math.floor(userExp.value / 1000) + 1);
const userInitial = computed(() => user.value?.username?.charAt(0).toUpperCase() || '?');

const xpPercentage = computed(() => {
  if (!userExp.value) return 0;
  const levelXP = (userLevel.value - 1) * 1000;
  const nextLevelXP = userLevel.value * 1000;
  return ((userExp.value - levelXP) / (nextLevelXP - levelXP)) * 100;
});

const nextLevelXP = computed(() => userLevel.value * 1000);

const navTabs = [
  { path: '/dashboard', name: 'Главная', emoji: '🏠' },
  { path: '/lessons', name: 'Уроки', emoji: '📚' },
  { path: '/leaderboard', name: 'Рейтинг', emoji: '🏆' },
  { path: '/community', name: 'Сообщество', emoji: '👥' },
];

// Проверка возможности получения награды
const checkDailyReward = () => {
  const lastRewardDate = localStorage.getItem('dailyRewardDate');
  const today = new Date().toDateString();

  if (lastRewardDate === today) {
    dailyRewardClaimed.value = true;
    return false;
  }

  dailyRewardClaimed.value = false;
  return true;
};

// Получение времени до следующей награды
const getTimeUntilNextReward = () => {
  const lastReward = localStorage.getItem('dailyRewardDate');
  if (!lastReward) return 'доступно сейчас';

  const lastDate = new Date(lastReward);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + 1);
  nextDate.setHours(0, 0, 0, 0);

  const now = new Date();
  const diff = nextDate.getTime() - now.getTime();

  if (diff <= 0) return 'доступно сейчас';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours} ч ${minutes} мин`;
  return `${minutes} мин`;
};

// Форматирование времени для отображения
const rewardCooldownText = computed(() => {
  if (!dailyRewardClaimed.value && checkDailyReward()) {
    return 'доступно!';
  }
  return getTimeUntilNextReward();
});

// Получение награды
const claimDailyReward = () => {
  if (!checkDailyReward()) {
    const timeLeft = getTimeUntilNextReward();
    showNotification(`🎁 Ты уже получил награду сегодня! Следующая через ${timeLeft}`, 'info');
    return;
  }

  const rewardXP = 50;
  const rewardBonus = Math.floor(Math.random() * 30) + 20;

  if (authStore.user) {
    const newExp = userExp.value + rewardXP + rewardBonus;
    authStore.user.exp = newExp;
    localStorage.setItem('dailyRewardDate', new Date().toDateString());

    dailyRewardClaimed.value = true;
    showNotification(
      `🎁 Ежедневная награда! +${rewardXP + rewardBonus} XP (${rewardXP} + бонус ${rewardBonus})! 🎉`,
      'success',
    );

    const newLevel = Math.floor(newExp / 1000) + 1;
    if (newLevel > userLevel.value) {
      showNotification(`🎉 ПОЗДРАВЛЯЕМ! Ты достиг ${newLevel} уровня! 🎉`, 'success');
    }
  }
};

const getShapeStyle = (i: number) => ({
  left: Math.random() * 100 + '%',
  animationDelay: Math.random() * 10 + 's',
  animationDuration: Math.random() * 10 + 5 + 's',
  width: Math.random() * 100 + 50 + 'px',
  height: Math.random() * 100 + 50 + 'px',
  opacity: Math.random() * 0.3 + 0.1,
});

const getRandomCodeSymbol = () => {
  const symbols = [
    '{',
    '}',
    '(',
    ')',
    ';',
    '=',
    '+',
    '-',
    '*',
    '/',
    '<',
    '>',
    '&',
    '|',
    '!',
    '?',
    ':',
    '"',
    "'",
    '[',
    ']',
  ];
  return symbols[Math.floor(Math.random() * symbols.length)];
};

const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const id = Date.now();
  const emoji = type === 'success' ? '🎉' : type === 'error' ? '😢' : 'ℹ️';
  notifications.value.push({ id, message, type, emoji });
  setTimeout(() => {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  }, 3000);
};

const handleAuthSuccess = () => {
  showNotification('Добро пожаловать в CodeCraft!', 'success');
  showNotification('Ты получил 100 бонусных XP! 🎁', 'success');
  router.push('/dashboard');
};

const handleLogout = async () => {
  await authStore.logout();
  showNotification('До новых встреч! Приходи ещё! 👋', 'info');
  showUserMenu.value = false;
  router.push('/');
};

const goHome = () => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard');
  } else {
    router.push('/');
  }
};

const navigateTo = (path: string) => {
  router.push(path);
  showUserMenu.value = false;
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  showNotification(
    isDarkMode.value ? '🌙 Ночной режим активирован' : '☀️ Дневной режим активирован',
    'info',
  );
  showUserMenu.value = false;
};

const showAbout = () => {
  showNotification('💡 Помощь: напиши в поддержку support@codecraft.ru', 'info');
};

const showRules = () => {
  showNotification('📜 Правила: будь вежлив, не спамь, помогай другим!', 'info');
};

const showSupport = () => {
  showNotification('🆘 Поддержка ответит в течение 24 часов', 'info');
};

// Закрытие меню при клике вне
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-profile') && !target.closest('.user-menu')) {
    showUserMenu.value = false;
  }
};

// Обновление онлайн-счетчика и таймера награды
let onlineInterval: any;
let rewardTimerInterval: any;

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  onlineInterval = setInterval(() => {
    onlineCount.value = Math.floor(1200 + Math.random() * 300);
  }, 5000);

  // Проверяем ежедневную награду при загрузке
  checkDailyReward();

  // Обновляем таймер награды каждую минуту
  rewardTimerInterval = setInterval(() => {
    // Принудительно обновляем вычисляемое свойство
    rewardCooldownText.value;
  }, 60000);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  clearInterval(onlineInterval);
  if (rewardTimerInterval) clearInterval(rewardTimerInterval);
});
</script>

<style>
.avatar-placeholder {
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
  border: 2px solid white;
}

.avatar-placeholder.small {
  width: 50px;
  height: 50px;
  font-size: 20px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family:
    'Comic Neue', 'Segoe UI Emoji', 'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', cursive,
    sans-serif;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

/* Анимированный фон */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  overflow: hidden;
}

.gradient-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
}

@keyframes gradientShift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  bottom: -100px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: floatUp linear infinite;
  pointer-events: none;
}

@keyframes floatUp {
  from {
    transform: translateY(100vh) rotate(0deg);
  }
  to {
    transform: translateY(-100vh) rotate(360deg);
  }
}

/* Темная тема */
#app.dark-mode .gradient-bg {
  background: linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%);
}

#app.dark-mode .game-header,
#app.dark-mode .game-nav,
#app.dark-mode .game-footer {
  background: rgba(0, 0, 0, 0.4);
}

/* Контент приложения */
.app-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Хедер */
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 100;
  gap: 20px;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-emoji {
  font-size: 36px;
  animation: bounce 2s infinite;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-badge {
  background: #ff6b6b;
  color: white;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: bold;
}

/* Блок с информацией пользователя */
.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 20px 8px 15px;
  border-radius: 60px;
  backdrop-filter: blur(5px);
}

.stats-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.level-badge {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  padding: 6px 14px;
  border-radius: 40px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}

.level-icon {
  font-size: 16px;
}

.xp-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.xp-bar {
  width: 180px;
  height: 32px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 30px;
  overflow: hidden;
  position: relative;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd166, #ff6b6b);
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
  border-radius: 30px;
}

.xp-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.xp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
  white-space: nowrap;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  z-index: 2;
  pointer-events: none;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 12px 4px 8px;
  border-radius: 50px;
  transition: background 0.3s ease;
  position: relative;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.avatar-container {
  position: relative;
  width: 38px;
  height: 38px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #ffd166;
  object-fit: cover;
}

.avatar-ring {
  position: absolute;
  top: -2px;
  left: -2px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid rgba(255, 209, 102, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.username {
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: rgba(255, 255, 255, 0.8);
  font-size: 10px;
  transition: transform 0.3s ease;
}

.user-profile:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.logout-btn {
  background: rgba(255, 71, 87, 0.2);
  border: 1px solid rgba(255, 71, 87, 0.5);
  border-radius: 40px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #ff6b6b;
  padding: 0;
}

.logout-btn:hover {
  background: rgba(255, 71, 87, 0.4);
  transform: scale(1.05);
  border-color: #ff4757;
  color: white;
}

.logout-btn svg {
  width: 18px;
  height: 18px;
}

.login-btn-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Меню пользователя */
.user-menu {
  position: absolute;
  top: 70px;
  right: 30px;
  background: white;
  border-radius: 20px;
  padding: 20px;
  width: 280px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 200;
}

.menu-header {
  display: flex;
  gap: 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 15px;
}

.menu-header img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.menu-header h4 {
  color: #5a3e2b;
  margin-bottom: 5px;
  font-size: 16px;
}

.menu-header p {
  color: #999;
  font-size: 12px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-items button {
  padding: 10px 12px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #5a3e2b;
  width: 100%;
}

.menu-items button:hover {
  background: #f5f5f5;
  transform: translateX(5px);
}

.menu-items button span:first-child {
  font-size: 18px;
  width: 28px;
}

.logout-item {
  color: #ff4757 !important;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
  padding-top: 12px;
}

/* Навигация */
.game-nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  margin: 20px 30px;
  border-radius: 60px;
}

.game-nav button {
  padding: 10px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.game-nav button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.game-nav button.active {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.nav-emoji {
  font-size: 18px;
}

/* Основной контент */
.main-content {
  flex: 1;
  padding: 20px 30px;
  position: relative;
}

/* Welcome секция */
.welcome-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  min-height: auto;
}

.hero-section {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.hero-animation {
  position: relative;
  padding: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  overflow: hidden;
}

.code-rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.code-symbol {
  position: absolute;
  top: -20px;
  color: rgba(255, 255, 255, 0.2);
  font-size: 20px;
  font-family: monospace;
  animation: codeRain linear infinite;
}

@keyframes codeRain {
  to {
    transform: translateY(100vh);
  }
}

.hero-content {
  position: relative;
  text-align: center;
  z-index: 1;
}

.glitch-text {
  font-size: 80px;
  font-weight: bold;
  color: white;
  text-shadow:
    2px 2px 0 #ff6b6b,
    -2px -2px 0 #4ecdc4;
  animation: glitch 3s infinite;
  margin-bottom: 20px;
}

@keyframes glitch {
  0%,
  100% {
    transform: skew(0deg, 0deg);
  }
  95% {
    transform: skew(0deg, 0deg);
  }
  96% {
    transform: skew(5deg, 2deg);
  }
  97% {
    transform: skew(-5deg, -2deg);
  }
  98% {
    transform: skew(3deg, 1deg);
  }
  99% {
    transform: skew(-3deg, -1deg);
  }
}

.tagline {
  font-size: 24px;
  color: white;
  margin-bottom: 40px;
}

.features {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 50px;
}

.feature {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: blur(5px);
}

.feature-emoji {
  font-size: 24px;
}

.play-now-btn {
  position: relative;
  padding: 18px 40px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  border-radius: 60px;
  font-size: 20px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.play-now-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.play-now-btn:hover .btn-glow {
  left: 100%;
}

/* Футер */
.game-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  margin-top: auto;
  flex-shrink: 0;
}

.daily-reward {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  padding: 8px 20px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.daily-reward:hover:not(.claimed) {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.daily-reward.claimed {
  background: linear-gradient(135deg, #888, #666);
  cursor: not-allowed;
  opacity: 0.7;
}

.daily-reward.claimed:hover {
  transform: none;
}

.reward-icon {
  font-size: 24px;
  animation: bounce 1s infinite;
}

.reward-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.reward-cooldown {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.reward-available {
  font-size: 10px;
  color: #ffd166;
  animation: rewardPulse 1s infinite;
}

@keyframes rewardPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.online-count {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
}

.online-dot {
  width: 8px;
  height: 8px;
  background: #6bcb77;
  border-radius: 50%;
  animation: onlinePulse 1.5s infinite;
}

@keyframes onlinePulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
  font-size: 14px;
}

.footer-links a:hover {
  color: #ffd166;
}

/* Уведомления */
.notifications {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  background: white;
  padding: 12px 20px;
  border-radius: 50px;
  margin-bottom: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideInRight 0.3s ease;
}

.notification.success {
  background: linear-gradient(135deg, #6bcb77, #4ecdc4);
  color: white;
}

.notification.error {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
}

.notification-emoji {
  font-size: 18px;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* Анимации переходов */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .user-info {
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .stats-container {
    flex-wrap: wrap;
    justify-content: center;
  }

  .xp-bar {
    width: 100px;
  }

  .username {
    max-width: 100px;
  }

  .game-nav {
    flex-wrap: wrap;
    margin: 15px;
    gap: 10px;
  }

  .game-nav button {
    padding: 8px 16px;
    font-size: 13px;
  }

  .nav-text {
    display: none;
  }

  .glitch-text {
    font-size: 40px;
  }

  .tagline {
    font-size: 18px;
  }

  .features {
    gap: 12px;
  }

  .feature {
    font-size: 12px;
    padding: 6px 12px;
  }

  .game-footer {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .daily-reward {
    width: 100%;
    justify-content: center;
  }

  .reward-info {
    align-items: center;
  }

  .main-content {
    padding: 15px;
  }
}
</style>
