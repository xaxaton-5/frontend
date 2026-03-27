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
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: currentTab === tab.id }"
        @click="currentTab = tab.id"
      >
        <span class="tab-emoji">{{ tab.emoji }}</span>
        {{ tab.name }}
      </button>
    </div>

    <!-- Чат -->
    <div
      v-if="currentTab === 'chat'"
      class="chat-section"
    >
      <div class="chat-container">
        <div class="chat-header">
          <div
            class="connection-status"
            :class="{ connected: chatStore.isConnected }"
          >
            {{ chatStore.isConnected ? '🟢 Онлайн' : '🔴 Офлайн' }}
          </div>
        </div>

        <div
          class="chat-messages"
          ref="chatMessages"
        >
          <div
            v-for="message in chatStore.sortedMessages"
            :key="message.id"
            class="message"
            :class="{ 'own-message': message.from_user === currentUserId }"
          >
            <div class="message-avatar">
              {{ getInitials(getUsernameById(message.from_user)) }}
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">{{ getUsernameById(message.from_user) }}</span>
                <span class="message-time">{{ formatTime(message.sent_date) }}</span>
              </div>
              <p class="message-text">{{ message.text }}</p>
            </div>
          </div>

          <div
            v-if="chatStore.isLoading"
            class="loading-messages"
          >
            <div class="spinner-small"></div>
            <span>Загрузка сообщений...</span>
          </div>
        </div>

        <div class="chat-input">
          <textarea
            v-model="newMessage"
            placeholder="Напиши сообщение... Используй эмодзи для веселья! 🎉"
            @keypress.enter.exact.prevent="sendMessage"
            :disabled="!chatStore.isConnected"
          ></textarea>
          <div class="input-actions">
            <button
              class="emoji-picker-btn"
              @click="showEmojiPicker = !showEmojiPicker"
            >
              😊
            </button>
            <button
              class="send-btn"
              @click="sendMessage"
              :disabled="!newMessage.trim() || !chatStore.isConnected"
            >
              📤 Отправить
            </button>
          </div>
          <div
            v-if="showEmojiPicker"
            class="emoji-picker"
          >
            <button
              v-for="emoji in emojis"
              :key="emoji"
              @click="addEmoji(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <div class="online-users">
        <h3>🟢 Онлайн ({{ onlineUsersCount }})</h3>
        <div class="users-list">
          <div
            v-for="user in onlineUsers"
            :key="user.id"
            class="online-user"
          >
            <div class="user-avatar-small">
              {{ user.username.charAt(0).toUpperCase() }}
            </div>
            <span>{{ user.username }}</span>
            <span class="online-dot-small"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Достижения -->
    <div
      v-if="currentTab === 'achievements'"
      class="achievements-section"
    >
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
            <span class="achievement-unlock-date">
              🎉 Получено: {{ achievement.unlockedDate }}
            </span>
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

    <!-- Галлерея проектов -->
    <div
      v-if="currentTab === 'projects'"
      class="projects-section"
    >
      <div class="projects-header">
        <h2>🎨 Проекты участников</h2>
        <button
          class="share-project-btn"
          @click="showShareModal = true"
        >
          📤 Поделиться проектом
        </button>
      </div>

      <div class="projects-grid">
        <div
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          @click="viewProject(project)"
        >
          <div class="project-preview">
            <div class="project-code-preview">
              <pre><code>{{ project.codeSnippet }}</code></pre>
            </div>
            <div class="project-overlay">
              <span>👁️ Посмотреть</span>
            </div>
          </div>
          <div class="project-info">
            <div class="project-author">
              <img
                :src="project.authorAvatar"
                alt="Author"
              />
              <span>{{ project.author }}</span>
            </div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-stats">
              <span>❤️ {{ project.likes }}</span>
              <span>💬 {{ project.comments }}</span>
              <span>👁️ {{ project.views }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для проекта -->
    <div
      v-if="selectedProject"
      class="project-modal"
      @click.self="selectedProject = null"
    >
      <div class="project-modal-content">
        <button
          class="modal-close"
          @click="selectedProject = null"
        >
          ✕
        </button>
        <h2>{{ selectedProject.title }}</h2>
        <div class="project-author-modal">
          <img
            :src="selectedProject.authorAvatar"
            alt="Author"
          />
          <span>{{ selectedProject.author }}</span>
        </div>
        <div class="project-code-full">
          <pre><code>{{ selectedProject.codeSnippet }}</code></pre>
        </div>
        <div class="project-description">
          <h3>Описание:</h3>
          <p>{{ selectedProject.description }}</p>
        </div>
        <div class="project-actions">
          <button
            class="like-btn"
            @click="likeProject"
          >
            ❤️ {{ selectedProject.likes }}
          </button>
          <button class="comment-btn">💬 Комментировать</button>
          <button class="run-btn">▶️ Запустить код</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно для шаринга проекта -->
    <div
      v-if="showShareModal"
      class="share-modal"
      @click.self="showShareModal = false"
    >
      <div class="share-modal-content">
        <h2>📤 Поделиться проектом</h2>
        <input
          v-model="shareTitle"
          placeholder="Название проекта"
        />
        <textarea
          v-model="shareDescription"
          placeholder="Описание проекта"
        ></textarea>
        <textarea
          v-model="shareCode"
          placeholder="Твой код"
        ></textarea>
        <button @click="shareProject">Опубликовать</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import type { User } from '@/services/authService';
import { usersService } from '@/services/usersService';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { useUserStatsStore } from '@/stores/userStatsStore';

const authStore = useAuthStore();
const userStatsStore = useUserStatsStore();
const chatStore = useChatStore();

const currentTab = ref('chat');
const showEmojiPicker = ref(false);
const showShareModal = ref(false);
const newMessage = ref('');
const selectedProject = ref<any>(null);
const chatMessages = ref<HTMLElement>();
const allUsers = ref<User[]>([]);
const isLoadingUsers = ref(false);

const shareTitle = ref('');
const shareDescription = ref('');
const shareCode = ref('');

const currentUserId = computed(() => authStore.user?.id);

// Онлайн пользователи (временно - все пользователи)
const onlineUsers = computed(() => allUsers.value);
const onlineUsersCount = computed(() => onlineUsers.value.length);

const tabs = [
  { id: 'chat', name: 'Чат', emoji: '💬' },
  { id: 'achievements', name: 'Достижения', emoji: '🏅' },
  { id: 'projects', name: 'Проекты', emoji: '🎨' },
];

const emojis = ['😊', '🎉', '👍', '❤️', '🔥', '🚀', '💻', '🎮', '⭐', '🏆'];

const projects = ref([
  {
    id: 1,
    title: 'Калькулятор',
    author: 'КодоМастер',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
    description: 'Простой калькулятор на JavaScript',
    codeSnippet: `function calc(a, b, op) {
  if(op === '+') return a + b;
  if(op === '-') return a - b;
}`,
    likes: 15,
    comments: 3,
    views: 128,
  },
  {
    id: 2,
    title: 'Игра "Угадай число"',
    author: 'ХакерКот',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HackerCat',
    description: 'Угадай случайное число от 1 до 100',
    codeSnippet: `let secret = Math.floor(Math.random() * 100) + 1;
let guess = prompt('Угадай число:');`,
    likes: 27,
    comments: 8,
    views: 256,
  },
]);

// Достижения из store
const achievements = computed(() => userStatsStore.achievements);
const totalAchievements = computed(() => userStatsStore.totalAchievements);
const userAchievementsCount = computed(() => userStatsStore.unlockedAchievementsCount);
const completionPercent = computed(() =>
  Math.round((userAchievementsCount.value / totalAchievements.value) * 100),
);

// Получение списка всех пользователей
const fetchAllUsers = async () => {
  isLoadingUsers.value = true;
  try {
    const data = await usersService.getUsers();
    allUsers.value = data.sort((a, b) => b.exp - a.exp);
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  } finally {
    isLoadingUsers.value = false;
  }
};

// Получение имени пользователя по ID из стора
const getUsernameById = (userId: number): string => {
  const user = allUsers.value.find((u) => u.id === userId);
  return user?.username || `Пользователь ${userId}`;
};

const getInitials = (name: string): string => {
  return name.charAt(0).toUpperCase();
};

const formatTime = (datetime: string): string => {
  const date = new Date(datetime);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

// Поделиться достижением в ВК
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

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  await chatStore.sendMessage(newMessage.value);
  newMessage.value = '';

  setTimeout(scrollToBottom, 100);
};

const addEmoji = (emoji: string) => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;
};

const showReactionPicker = (messageId: number) => {
  console.log('Show reaction picker for message', messageId);
};

const viewProject = (project: any) => {
  selectedProject.value = project;
};

const likeProject = () => {
  if (selectedProject.value) {
    selectedProject.value.likes++;
  }
};

const shareProject = () => {
  projects.value.push({
    id: projects.value.length + 1,
    title: shareTitle.value,
    author: authStore.user?.username || 'Аноним',
    authorAvatar: authStore.user?.avatar || '',
    description: shareDescription.value,
    codeSnippet: shareCode.value,
    likes: 0,
    comments: 0,
    views: 0,
  });

  showShareModal.value = false;
  shareTitle.value = '';
  shareDescription.value = '';
  shareCode.value = '';

  currentTab.value = 'projects';
};

// Следим за новыми сообщениями
watch(
  () => chatStore.messages.length,
  () => {
    scrollToBottom();
  },
);

onMounted(async () => {
  await Promise.all([chatStore.init(), fetchAllUsers()]);
  scrollToBottom();
});

onUnmounted(() => {
  chatStore.cleanup();
});
</script>

<style scoped>
/* Стили остаются без изменений */
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

.community-tabs button {
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

.community-tabs button.active {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
}

.chat-section {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  height: 600px;
}

.chat-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: flex-end;
}

.connection-status {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
}

.connection-status.connected {
  color: #6bcb77;
}

.connection-status:not(.connected) {
  color: #ff6b6b;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message {
  display: flex;
  gap: 12px;
  animation: fadeInUp 0.3s ease;
}

.message-avatar {
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
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 10px 15px;
}

.own-message {
  flex-direction: row-reverse;
}

.own-message .message-content {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.message-author {
  font-weight: bold;
  color: white;
}

.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.message-text {
  color: white;
  margin-bottom: 8px;
  word-break: break-word;
}

.loading-messages {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: rgba(255, 255, 255, 0.7);
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffd166;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.chat-input {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.chat-input textarea {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  color: white;
  resize: none;
  font-family: inherit;
  margin-bottom: 10px;
}

.chat-input textarea:disabled {
  opacity: 0.5;
}

.input-actions {
  display: flex;
  justify-content: space-between;
}

.emoji-picker-btn,
.send-btn {
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20px;
  color: white;
  cursor: pointer;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.emoji-picker {
  position: absolute;
  bottom: 80px;
  left: 20px;
  background: white;
  border-radius: 15px;
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.emoji-picker button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.online-users {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 20px;
}

.online-users h3 {
  color: white;
  margin-bottom: 15px;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.online-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
  transition: background 0.3s ease;
}

.online-user:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar-small {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
}

.online-user span {
  color: white;
  flex: 1;
}

.online-dot-small {
  width: 8px;
  height: 8px;
  background: #6bcb77;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

/* Достижения */
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

/* Проекты */
.projects-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.projects-header h2 {
  color: white;
}

.share-project-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.project-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.project-preview {
  position: relative;
  height: 150px;
  background: #1e1e1e;
  overflow: hidden;
}

.project-code-preview {
  padding: 15px;
  height: 100%;
  overflow: hidden;
}

.project-code-preview pre {
  font-size: 10px;
  line-height: 1.3;
  margin: 0;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-overlay span {
  color: white;
  font-weight: bold;
}

.project-info {
  padding: 15px;
}

.project-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.project-author img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.project-author span {
  color: #ffd166;
  font-size: 12px;
}

.project-info h3 {
  color: white;
  margin-bottom: 5px;
}

.project-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-bottom: 10px;
}

.project-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* Модальные окна */
.project-modal,
.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.project-modal-content,
.share-modal-content {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 30px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.project-author-modal {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.project-author-modal img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.project-code-full {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.project-code-full pre {
  margin: 0;
  font-size: 12px;
}

.project-description {
  margin-bottom: 20px;
}

.project-description h3 {
  color: #ffd166;
  margin-bottom: 8px;
}

.project-description p {
  color: white;
}

.project-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.like-btn,
.comment-btn,
.run-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
}

.like-btn {
  background: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.comment-btn {
  background: rgba(255, 209, 102, 0.3);
  color: #ffd166;
}

.run-btn {
  background: rgba(107, 203, 119, 0.3);
  color: #6bcb77;
}

.share-modal-content input,
.share-modal-content textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.share-modal-content textarea {
  min-height: 100px;
}

.share-modal-content button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .community-page {
    padding: 15px;
  }

  .chat-section {
    grid-template-columns: 1fr;
    height: auto;
  }

  .online-users {
    display: none;
  }

  .community-tabs button {
    padding: 8px 16px;
    font-size: 12px;
  }

  .page-title {
    font-size: 32px;
  }

  .title-emoji {
    font-size: 36px;
  }

  .achievements-stats {
    grid-template-columns: 1fr;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .projects-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .project-actions {
    flex-direction: column;
  }
}
</style>
