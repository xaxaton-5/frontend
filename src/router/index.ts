// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Community from '@/views/Community.vue';
// Импортируем существующие компоненты
import Dashboard from '@/views/Dashboard.vue';
import Leaderboard from '@/views/Leaderboard.vue';
import Lessons from '@/views/Lessons.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    // Используем компонент Dashboard как главную страницу для авторизованных
    // и показываем welcome-screen для неавторизованных
    component: Dashboard,
    meta: {
      title: 'CodeCraft - Изучай программирование играя!',
      requiresAuth: false,
      transition: 'fade',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      title: 'Панель управления',
      requiresAuth: true,
      transition: 'slide-up',
    },
  },
  {
    path: '/lessons',
    name: 'lessons',
    component: Lessons,
    meta: {
      title: 'Уроки программирования',
      requiresAuth: true,
      transition: 'slide-right',
    },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard,
    meta: {
      title: 'Таблица лидеров',
      requiresAuth: true,
      transition: 'slide-left',
    },
  },
  {
    path: '/community',
    name: 'community',
    component: Community,
    meta: {
      title: 'Сообщество',
      requiresAuth: true,
      transition: 'fade',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    // Перенаправляем на главную, так как у нас нет отдельной страницы 404
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
});

// Навигационный барьер для авторизации
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Устанавливаем заголовок страницы
  document.title = to.meta.title
    ? `${to.meta.title} | CodeCraft`
    : 'CodeCraft - Изучай программирование играя!';

  // Проверка на авторизацию
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Сохраняем путь для редиректа после входа
    next({
      path: '/',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
