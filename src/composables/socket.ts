import { ref } from 'vue';
import { toast } from '@/main';
import { getToken } from '@/utils/token';

export const useSocket = () => {
  const socket = ref<WebSocket | null>(null);

  const initSocket = () => {
    const token = getToken();
    if (!token) return;

    socket.value = new WebSocket(`${import.meta.env.VITE_WEB_SOCKET_URL}?access_token=${token}`);

    socket.value.addEventListener('message', (e) => {
      const data = JSON.parse(e.data) as unknown as { command: string; message: string };
      if (data.command === 'notify') {
        toast.add({
          severity: 'info',
          summary: 'Уведомление',
          detail: data.message,
          life: 3000,
        });
      }
    });
  };

  return {
    initSocket,
  };
};
