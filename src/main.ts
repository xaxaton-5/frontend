// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/authStore';
import { useModulesStore } from './stores/modulesStore';
import { useUserStatsStore } from './stores/userStatsStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Ждем инициализации всех сторов
const initApp = async () => {
  const authStore = useAuthStore();
  const userStatsStore = useUserStatsStore();
  const modulesStore = useModulesStore();

  await authStore.init();
  userStatsStore.init();
  await modulesStore.init();

  app.mount('#app');
};

initApp();
