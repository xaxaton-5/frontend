// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/style.scss';
import router from './router';
import { useAuthStore } from './stores/authStore';
import { useUserStatsStore } from './stores/userStatsStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Инициализация
const authStore = useAuthStore();
const userStatsStore = useUserStatsStore();

authStore.init();
userStatsStore.init();

app.mount('#app');
