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
        <div
          class="chat-messages"
          ref="chatMessages"
        >
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{ 'own-message': message.userId === currentUserId }"
          >
            <img
              :src="message.avatar"
              alt="Avatar"
              class="message-avatar"
            />
            <div class="message-content">
              <div class="message-header">
                <span class="message-author">{{ message.username }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <p class="message-text">{{ message.text }}</p>
              <div class="message-reactions">
                <button
                  v-for="reaction in message.reactions"
                  :key="reaction.emoji"
                  class="reaction-btn"
                >
                  {{ reaction.emoji }} {{ reaction.count }}
                </button>
                <button
                  class="add-reaction"
                  @click="showReactionPicker(message.id)"
                >
                  ➕
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-input">
          <textarea
            v-model="newMessage"
            placeholder="Напиши сообщение... Используй эмодзи для веселья! 🎉"
            @keypress.enter.exact.prevent="sendMessage"
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
        <h3>🟢 Онлайн ({{ onlineUsers.length }})</h3>
        <div class="users-list">
          <div
            v-for="user in onlineUsers"
            :key="user.id"
            class="online-user"
          >
            <img
              :src="user.avatar"
              alt="Avatar"
            />
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
          <div class="achievement-xp">+{{ achievement.xp }} XP</div>
          <div
            v-if="!achievement.unlocked"
            class="achievement-lock"
          >
            🔒
          </div>
          <div
            v-else
            class="achievement-unlock-date"
          >
            Получено: {{ achievement.unlockDate }}
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
import { ref, computed, nextTick } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const currentTab = ref('chat');
const showEmojiPicker = ref(false);
const showShareModal = ref(false);
const newMessage = ref('');
const selectedProject = ref<any>(null);
const chatMessages = ref<HTMLElement>();

const shareTitle = ref('');
const shareDescription = ref('');
const shareCode = ref('');

const currentUserId = computed(() => authStore.user?.id);

const tabs = [
  { id: 'chat', name: 'Чат', emoji: '💬' },
  { id: 'achievements', name: 'Достижения', emoji: '🏅' },
  { id: 'projects', name: 'Проекты', emoji: '🎨' },
];

const emojis = ['😊', '🎉', '👍', '❤️', '🔥', '🚀', '💻', '🎮', '⭐', '🏆'];

const messages = ref([
  {
    id: 1,
    userId: 2,
    username: 'ХакерКот',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HackerCat',
    text: 'Всем привет! Только что прошёл модуль по циклам! 🎉',
    time: '10:42',
    reactions: [{ emoji: '👍', count: 3 }],
  },
  {
    id: 2,
    userId: 3,
    username: 'ПиксельПанда',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelPanda',
    text: 'Круто! У меня тоже получилось! Циклы - это очень полезно 🔄',
    time: '10:45',
    reactions: [{ emoji: '🔥', count: 2 }],
  },
]);

const onlineUsers = ref([
  {
    id: 1,
    username: 'КодоМастер',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
  },
  {
    id: 2,
    username: 'ХакерКот',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HackerCat',
  },
  {
    id: 3,
    username: 'ПиксельПанда',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PixelPanda',
  },
]);

const achievements = ref([
  {
    id: 1,
    title: 'Первая переменная',
    description: 'Создал свою первую переменную',
    icon: '📦',
    xp: 50,
    unlocked: true,
    unlockDate: '15.03.2024',
  },
  {
    id: 2,
    title: 'Король циклов',
    description: 'Решил 10 задач на циклы',
    icon: '🔄',
    xp: 100,
    unlocked: true,
    unlockDate: '18.03.2024',
  },
  {
    id: 3,
    title: 'Мастер функций',
    description: 'Создал 5 собственных функций',
    icon: '⚡',
    xp: 150,
    unlocked: false,
    unlockDate: '',
  },
  {
    id: 4,
    title: 'Баг-хантер',
    description: 'Нашёл и исправил 10 ошибок в коде',
    icon: '🐛',
    xp: 200,
    unlocked: false,
    unlockDate: '',
  },
  {
    id: 5,
    title: 'Социальный кодер',
    description: 'Отправил 50 сообщений в чате',
    icon: '💬',
    xp: 100,
    unlocked: false,
    unlockDate: '',
  },
]);

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

const totalAchievements = computed(() => achievements.value.length);
const userAchievementsCount = computed(() => achievements.value.filter((a) => a.unlocked).length);
const completionPercent = computed(() =>
  Math.round((userAchievementsCount.value / totalAchievements.value) * 100),
);

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const message = {
    id: messages.value.length + 1,
    userId: currentUserId.value,
    username: authStore.user?.username || 'Ты',
    avatar: authStore.user?.avatar || '',
    text: newMessage.value,
    time: new Date().toLocaleTimeString().slice(0, 5),
    reactions: [],
  };

  messages.value.push(message);
  newMessage.value = '';

  await nextTick();
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
};

const addEmoji = (emoji: string) => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;
};

const showReactionPicker = (messageId: number) => {
  // Реализация выбора реакции
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
  border-radius: 50%;
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
  color: #ffd166;
}

.message-time {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.message-text {
  color: white;
  margin-bottom: 8px;
}

.message-reactions {
  display: flex;
  gap: 5px;
}

.reaction-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
  color: white;
}

.add-reaction {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.5;
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

.online-user img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
}

.achievement-lock {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
}

.achievement-unlock-date {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 10px;
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
</style>
