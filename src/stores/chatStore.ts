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
  let wsMessageIdSeq = 0;

  // Состояние
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const ws = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const onlineUsers = ref<User[]>([]);

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
    const wsUrl = import.meta.env.VITE_WEB_SOCKET_URL || 'ws://localhost:5001/ws';

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

        // { "event": "user_list_changed", "data": [ User, ... ] }
        if (data.event === 'user_list_changed' && Array.isArray(data.data)) {
          onlineUsers.value = [...data.data].sort((a: User, b: User) => b.exp - a.exp);
          return;
        }

        // { "event": "text_message", "data": { text, sender_name, sender_id } }
        if (
          data.event === 'text_message' &&
          data.data &&
          typeof data.data === 'object' &&
          !Array.isArray(data.data)
        ) {
          const p = data.data as {
            text?: string;
            sender_id?: number;
            sender_name?: string;
            id?: number;
            sent_date?: string;
            from_user?: number;
          };
          const fromUser = p.sender_id ?? p.from_user;
          const text = p.text;
          if (fromUser != null && text != null) {
            wsMessageIdSeq += 1;
            const newMessage: ChatMessage = {
              id: typeof p.id === 'number' ? p.id : Date.now() + wsMessageIdSeq,
              from_user: fromUser,
              text,
              sent_date:
                typeof p.sent_date === 'string'
                  ? p.sent_date
                  : new Date().toISOString(),
            };
            addMessage(newMessage);
          }
          return;
        }

        // Legacy: плоский payload или вложенный data-объект без известного event
        const payload =
          data &&
          typeof data.data === 'object' &&
          data.data !== null &&
          !Array.isArray(data.data)
            ? data.data
            : data;

        const fromUser = payload.from_user ?? payload.sender_id;
        const legacyText = payload.text;

        if (fromUser != null && legacyText != null) {
          wsMessageIdSeq += 1;
          addMessage({
            id: typeof payload.id === 'number' ? payload.id : Date.now() + wsMessageIdSeq,
            from_user: fromUser,
            text: legacyText,
            sent_date:
              typeof payload.sent_date === 'string'
                ? payload.sent_date
                : new Date().toISOString(),
          });
        }
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
      onlineUsers.value = [];
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
    onlineUsers,

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
