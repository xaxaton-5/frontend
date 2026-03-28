// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: 'CodeCraft - Изучай программирование играя!',
      requiresAuth: false,
      transition: 'fade',
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: 'Панель управления',
      requiresAuth: true,
      transition: 'slide-up',
    },
  },
  {
    path: '/lessons',
    name: 'lessons',
    component: () => import('@/views/Lessons.vue'),
    meta: {
      title: 'Уроки программирования',
      requiresAuth: true,
      transition: 'slide-right',
    },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('@/views/Leaderboard.vue'),
    meta: {
      title: 'Таблица лидеров',
      requiresAuth: true,
      transition: 'slide-left',
    },
  },
  {
    path: '/community',
    component: () => import('@/views/Community.vue'),
    meta: {
      title: 'Сообщество',
      requiresAuth: true,
      transition: 'fade',
    },
    children: [
      {
        path: '',
        name: 'community',
        redirect: '/community/chat',
      },
      {
        path: 'chat',
        name: 'community-chat',
        component: () => import('@/views/community/Chat.vue'),
        meta: {
          title: 'Чат сообщества',
        },
      },
      {
        path: 'achievements',
        name: 'community-achievements',
        component: () => import('@/views/community/Achievements.vue'),
        meta: {
          title: 'Достижения сообщества',
        },
      },
    ],
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      title: 'Мой профиль',
      requiresAuth: true,
      transition: 'slide-up',
    },
  },
  {
    path: '/achievements',
    name: 'achievements',
    component: () => import('@/views/Achievements.vue'),
    meta: {
      title: 'Мои достижения',
      requiresAuth: true,
      transition: 'slide-up',
    },
  },
  {
    path: '/children',
    name: 'children',
    component: () => import('@/views/Children.vue'),
    meta: {
      title: 'Мои дети',
      requiresAuth: true,
      transition: 'slide-up',
      parentOnly: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  document.title = to.meta.title
    ? `${to.meta.title} | CodeCraft`
    : 'CodeCraft - Изучай программирование играя!';

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/',
      query: { redirect: to.fullPath },
    });
  } else if (to.meta.parentOnly && !authStore.user?.is_parent) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
