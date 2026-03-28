<!-- views/community/Chat.vue -->
<template>
  <div class="chat-section">
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
          <button
            class="message-avatar profile-trigger"
            type="button"
            @click="openUserProfile(message.from_user)"
          >
            {{ getInitials(getUsernameById(message.from_user)) }}
          </button>
          <div class="message-content">
            <div class="message-header">
              <button
                class="message-author profile-trigger"
                type="button"
                @click="openUserProfile(message.from_user)"
              >
                {{ getUsernameById(message.from_user) }}
              </button>
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
          role="button"
          tabindex="0"
          @click="openUserProfile(user.id)"
          @keydown.enter="openUserProfile(user.id)"
          @keydown.space.prevent="openUserProfile(user.id)"
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { User } from '@/services/authService';
import { usersService } from '@/services/usersService';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';

const router = useRouter();
const authStore = useAuthStore();
const chatStore = useChatStore();

const showEmojiPicker = ref(false);
const newMessage = ref('');
const chatMessages = ref<HTMLElement>();
const allUsers = ref<User[]>([]);

const currentUserId = computed(() => authStore.user?.id);

const onlineUsers = computed(() => chatStore.onlineUsers);
const onlineUsersCount = computed(() => onlineUsers.value.length);

const emojis = ['😊', '🎉', '👍', '❤️', '🔥', '🚀', '💻', '🎮', '⭐', '🏆'];

const fetchAllUsers = async () => {
  try {
    const data = await usersService.getUsers();
    allUsers.value = data.sort((a, b) => b.exp - a.exp);
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  }
};

const getUsernameById = (userId: number): string => {
  const fromOnline = chatStore.onlineUsers.find((u) => u.id === userId);
  if (fromOnline) return fromOnline.username;
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

const openUserProfile = (userId: number) => {
  if (currentUserId.value === userId) {
    router.push('/profile');
    return;
  }

  router.push(`/users/${userId}`);
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
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
.chat-section {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  height: calc(100vh - 280px);
  min-height: 500px;
}

.chat-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.chat-header {
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
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

.profile-trigger {
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
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
  background: transparent;
}

.message-author:hover,
.message-avatar:hover {
  opacity: 0.85;
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
  flex-shrink: 0;
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

.chat-input textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
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
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.online-users h3 {
  color: white;
  margin-bottom: 15px;
  flex-shrink: 0;
}

.users-list {
  flex: 1;
  overflow-y: auto;
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
  flex-shrink: 0;
  cursor: pointer;
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
}

.online-dot-small {
  width: 8px;
  height: 8px;
  background: #6bcb77;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
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
  .chat-section {
    grid-template-columns: 1fr;
    height: calc(100vh - 200px);
  }

  .online-users {
    display: none;
  }
}

/* Кастомный скроллбар */
.chat-messages::-webkit-scrollbar,
.users-list::-webkit-scrollbar {
  width: 5px;
}

.chat-messages::-webkit-scrollbar-track,
.users-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.chat-messages::-webkit-scrollbar-thumb,
.users-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.chat-messages::-webkit-scrollbar-thumb:hover,
.users-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

/* Для Firefox */
.chat-messages,
.users-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) rgba(255, 255, 255, 0.08);
}
</style>
