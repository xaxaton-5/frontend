// stores/chatStore.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axiosInstance from '@/api/axiosInstance';
import type { User } from '@/services/authService';

export interface ChatMessage {
  id: number;
  from_user: number;
  text: string;
  sent_date: string;
  user?: User;
}

export const useChatStore = defineStore('chat', () => {
  // Состояние
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);

  // Геттеры
  const messagesCount = computed(() => messages.value.length);

  const sortedMessages = computed(() => {
    return [...messages.value].sort(
      (a, b) => new Date(a.sent_date).getTime() - new Date(b.sent_date).getTime(),
    );
  });

  // Загрузка истории сообщений
  const fetchMessages = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await axiosInstance.get('/messages/list/');
      messages.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка загрузки сообщений';
      console.error('Ошибка загрузки сообщений:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Отправка сообщения
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    try {
      await axiosInstance.post('/messages/send/', { text });
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Ошибка отправки сообщения';
      console.error('Ошибка отправки сообщения:', err);
    }
  };

  // Добавление нового сообщения (из WebSocket)
  const addMessage = (message: ChatMessage) => {
    // Проверяем, нет ли уже такого сообщения по id
    const exists = messages.value.some((m) => m.id === message.id);

    if (!exists) {
      messages.value.push(message);
    }
  };

  // Подключение к WebSocket
  const connectWebSocket = () => {
    const token = localStorage.getItem('access_token');
    const wsUrl = import.meta.env.VITE_WEB_SOCKET_URL;

    if (!wsUrl) {
      console.error('VITE_WEB_SOCKET_URL не задан в .env');
      return;
    }

    if (ws.value && ws.value.readyState === WebSocket.OPEN) {
      console.log('WebSocket уже подключен');
      return;
    }

    const url = `${wsUrl}?access_token=${token}`;
    ws.value = new WebSocket(url);

    ws.value.onopen = () => {
      console.log('WebSocket подключен');
      isConnected.value = true;
    };

    ws.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Получено сообщение от WebSocket:', data);

        // Обработка входящих сообщений
        // data может быть как объектом сообщения, так и содержать поле message
        let messageData: ChatMessage;

        if (data.message) {
          messageData = data.message;
        } else if (data.from_user !== undefined && data.text !== undefined) {
          messageData = data;
        } else {
          console.warn('Неизвестный формат сообщения:', data);
          return;
        }

        addMessage({
          id: messageData.id,
          from_user: messageData.from_user,
          text: messageData.text,
          sent_date: messageData.sent_date || new Date().toISOString(),
        });
      } catch (err) {
        console.error('Ошибка парсинга WebSocket сообщения:', err);
      }
    };

    ws.value.onerror = (error) => {
      console.error('WebSocket ошибка:', error);
      isConnected.value = false;
    };

    ws.value.onclose = () => {
      console.log('WebSocket отключен');
      isConnected.value = false;

      // Попытка переподключения через 5 секунд
      setTimeout(() => {
        if (!isConnected.value) {
          console.log('Попытка переподключения WebSocket...');
          connectWebSocket();
        }
      }, 5000);
    };
  };

  // Отключение WebSocket
  const disconnectWebSocket = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
      isConnected.value = false;
    }
  };

  // Очистка сообщений
  const clearMessages = () => {
    messages.value = [];
  };

  // Инициализация чата
  const init = async () => {
    await fetchMessages();
    connectWebSocket();
  };

  // Очистка при размонтировании
  const cleanup = () => {
    disconnectWebSocket();
  };

  return {
    // Состояние
    messages,
    isLoading,
    error,
    isConnected,

    // Геттеры
    messagesCount,
    sortedMessages,

    // Методы
    fetchMessages,
    sendMessage,
    addMessage,
    connectWebSocket,
    disconnectWebSocket,
    clearMessages,
    init,
    cleanup,
  };
});
