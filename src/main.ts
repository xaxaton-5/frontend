// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/style.scss';
import router from './router';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Инициализация авторизации перед монтированием
const authStore = useAuthStore();
authStore.init();

app.mount('#app');
