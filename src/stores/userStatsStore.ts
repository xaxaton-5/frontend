// stores/userStatsStore.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { modules } from '@/data/modules';
import { useAuthStore } from './authStore';

export interface UserStats {
  totalXp: number;
  level: number;
  completedLessons: number;
  completedGames: string[];
  unlockedAchievements: number[];
  dailyStreak: number;
  lastLoginDate: string | null;
  lessonsCompletedThisWeek: number;
  gamesCompletedThisWeek: number;
  xpEarnedThisWeek: number;
  weeklyResetDate: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate: string | null;
  xpReward: number;
  condition: (stats: UserStats) => boolean;
}

export const useUserStatsStore = defineStore('userStats', () => {
  const authStore = useAuthStore();

  const stats = ref<UserStats>({
    totalXp: 0,
    level: 1,
    completedLessons: 0,
    completedGames: [],
    unlockedAchievements: [],
    dailyStreak: 0,
    lastLoginDate: null,
    lessonsCompletedThisWeek: 0,
    gamesCompletedThisWeek: 0,
    xpEarnedThisWeek: 0,
    weeklyResetDate: new Date().toDateString(),
  });

  const allAchievements = ref<Achievement[]>([
    {
      id: 1,
      title: 'Первая переменная',
      description: 'Создал свою первую переменную',
      icon: '📦',
      unlocked: false,
      unlockedDate: null,
      xpReward: 50,
      condition: (s) => s.completedLessons >= 1,
    },
    {
      id: 2,
      title: 'Король циклов',
      description: 'Решил 10 задач на циклы',
      icon: '🔄',
      unlocked: false,
      unlockedDate: null,
      xpReward: 100,
      condition: (s) => {
        const module2 = modules.find((m) => m.id === 2);
        if (!module2) return false;
        const practiceLessons = module2.lessons.filter((l) => l.type === 'practice' && l.completed);
        return practiceLessons.length >= 2;
      },
    },
    {
      id: 3,
      title: 'Мастер условий',
      description: 'Решил 10 задач на if/else',
      icon: '🤔',
      unlocked: false,
      unlockedDate: null,
      xpReward: 100,
      condition: (s) => {
        const module3 = modules.find((m) => m.id === 3);
        if (!module3) return false;
        const practiceLessons = module3.lessons.filter((l) => l.type === 'practice' && l.completed);
        return practiceLessons.length >= 2;
      },
    },
    {
      id: 4,
      title: 'Победитель бота',
      description: 'Прошёл игру "Переменная битва"',
      icon: '🎮',
      unlocked: false,
      unlockedDate: null,
      xpReward: 100,
      condition: (s) => s.completedGames.includes('variables'),
    },
    {
      id: 5,
      title: 'Повелитель циклов',
      description: 'Прошёл игру "Цикло-битва"',
      icon: '🔄',
      unlocked: false,
      unlockedDate: null,
      xpReward: 100,
      condition: (s) => s.completedGames.includes('loops'),
    },
    {
      id: 6,
      title: 'Мастер решений',
      description: 'Прошёл игру "Робо-битва"',
      icon: '🤖',
      unlocked: false,
      unlockedDate: null,
      xpReward: 100,
      condition: (s) => s.completedGames.includes('conditions'),
    },
    {
      id: 7,
      title: 'Социальный кодер',
      description: 'Отправил 50 сообщений в чате',
      icon: '💬',
      unlocked: false,
      unlockedDate: null,
      xpReward: 100,
      condition: () => false,
    },
    {
      id: 8,
      title: 'Трудоголик',
      description: 'Провёл 10 часов в обучении',
      icon: '⏰',
      unlocked: false,
      unlockedDate: null,
      xpReward: 150,
      condition: () => false,
    },
    {
      id: 9,
      title: 'Ежедневный вход',
      description: 'Заходить в приложение 7 дней подряд',
      icon: '📅',
      unlocked: false,
      unlockedDate: null,
      xpReward: 50,
      condition: (s) => s.dailyStreak >= 7,
    },
    {
      id: 10,
      title: 'Отличник',
      description: 'Пройти тест на 100%',
      icon: '⭐',
      unlocked: false,
      unlockedDate: null,
      xpReward: 100,
      condition: () => false,
    },
  ]);

  // Геттеры
  const totalLessons = computed(() => modules.reduce((acc, m) => acc + m.lessons.length, 0));
  const totalGames = computed(() => 3);
  const completedGamesCount = computed(() => stats.value.completedGames.length);
  const unlockedAchievementsCount = computed(() => stats.value.unlockedAchievements.length);
  const totalAchievements = computed(() => allAchievements.value.length);

  const achievements = computed(() => {
    return allAchievements.value.map((ach) => ({
      ...ach,
      unlocked: stats.value.unlockedAchievements.includes(ach.id),
    }));
  });

  const recentAchievements = computed(() => {
    return achievements.value
      .filter((a) => a.unlocked)
      .sort((a, b) => {
        if (!a.unlockedDate || !b.unlockedDate) return 0;
        return new Date(b.unlockedDate).getTime() - new Date(a.unlockedDate).getTime();
      })
      .slice(0, 6);
  });

  const upcomingAchievements = computed(() => {
    return achievements.value.filter((a) => !a.unlocked).slice(0, 4);
  });

  const userLevel = computed(() => Math.floor(stats.value.totalXp / 1000) + 1);
  const xpPercentage = computed(() => {
    const levelXP = (userLevel.value - 1) * 1000;
    const nextLevelXP = userLevel.value * 1000;
    return ((stats.value.totalXp - levelXP) / (nextLevelXP - levelXP)) * 100;
  });
  const nextLevelXP = computed(() => userLevel.value * 1000);

  const updateDerivedStats = () => {
    stats.value.level = Math.floor(stats.value.totalXp / 1000) + 1;
  };

  const syncXpFromAuth = () => {
    if (authStore.user) {
      stats.value.totalXp = authStore.user.exp;
      updateDerivedStats();
    }
  };

  // Методы
  const loadStats = () => {
    const savedStats = localStorage.getItem('userStats');
    if (savedStats) {
      const parsed = JSON.parse(savedStats);
      stats.value = { ...stats.value, ...parsed };
    }

    const savedAchievements = localStorage.getItem('userAchievements');
    if (savedAchievements) {
      const saved = JSON.parse(savedAchievements);
      allAchievements.value.forEach((ach) => {
        const savedAch = saved.find((a: any) => a.id === ach.id);
        if (savedAch) {
          ach.unlocked = savedAch.unlocked;
          ach.unlockedDate = savedAch.unlockedDate;
        }
      });
    }

    syncXpFromAuth();

    checkDailyStreak();
    checkWeeklyReset();
    updateDerivedStats();
  };

  const saveStats = () => {
    localStorage.setItem('userStats', JSON.stringify(stats.value));

    const achievementsToSave = allAchievements.value.map((ach) => ({
      id: ach.id,
      unlocked: ach.unlocked,
      unlockedDate: ach.unlockedDate,
    }));
    localStorage.setItem('userAchievements', JSON.stringify(achievementsToSave));
  };

  const checkDailyStreak = () => {
    const today = new Date().toDateString();
    const lastLogin = stats.value.lastLoginDate;

    if (lastLogin === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLogin === yesterday.toDateString()) {
      stats.value.dailyStreak++;
    } else if (lastLogin !== today) {
      stats.value.dailyStreak = 1;
    }

    stats.value.lastLoginDate = today;
    saveStats();
    checkAchievements();
  };

  const checkWeeklyReset = () => {
    const today = new Date().toDateString();
    const lastReset = stats.value.weeklyResetDate;

    if (lastReset !== today) {
      const lastResetDate = new Date(lastReset);
      const todayDate = new Date(today);
      const weekDiff = Math.floor(
        (todayDate.getTime() - lastResetDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (weekDiff >= 7) {
        stats.value.lessonsCompletedThisWeek = 0;
        stats.value.gamesCompletedThisWeek = 0;
        stats.value.xpEarnedThisWeek = 0;
        stats.value.weeklyResetDate = today;
        saveStats();
      }
    }
  };

  const addLessonCompleted = () => {
    stats.value.completedLessons++;
    stats.value.lessonsCompletedThisWeek++;
    saveStats();
    checkAchievements();
  };

  const addGameCompleted = (gameType: string, xpEarned: number) => {
    if (!stats.value.completedGames.includes(gameType)) {
      stats.value.completedGames.push(gameType);
      stats.value.gamesCompletedThisWeek++;
      addXp(xpEarned);
    }
  };

  const addXp = (xpAmount: number) => {
    stats.value.totalXp += xpAmount;
    stats.value.xpEarnedThisWeek += xpAmount;
    updateDerivedStats();

    if (authStore.user) {
      authStore.setUserXp(stats.value.totalXp);
    }

    saveStats();
    checkAchievements();
  };

  const checkAchievements = () => {
    let hasNewAchievement = false;

    allAchievements.value.forEach((achievement) => {
      if (!achievement.unlocked && achievement.condition(stats.value)) {
        achievement.unlocked = true;
        achievement.unlockedDate = new Date().toLocaleDateString('ru-RU');
        stats.value.unlockedAchievements.push(achievement.id);
        stats.value.totalXp += achievement.xpReward;
        updateDerivedStats();
        hasNewAchievement = true;

        const newAchievements = JSON.parse(localStorage.getItem('newAchievements') || '[]');
        newAchievements.push({
          id: achievement.id,
          title: achievement.title,
          icon: achievement.icon,
          xp: achievement.xpReward,
        });
        localStorage.setItem('newAchievements', JSON.stringify(newAchievements));
      }
    });

    if (hasNewAchievement) {
      saveStats();
      if (authStore.user) {
        authStore.setUserXp(stats.value.totalXp);
      }
    }
  };

  const getNewAchievements = () => {
    const newAchievements = JSON.parse(localStorage.getItem('newAchievements') || '[]');
    localStorage.setItem('newAchievements', '[]');
    return newAchievements;
  };

  const init = () => {
    loadStats();

    const totalCompleted = modules.reduce((acc, m) => {
      return acc + m.lessons.filter((l) => l.completed).length;
    }, 0);

    if (totalCompleted !== stats.value.completedLessons) {
      stats.value.completedLessons = totalCompleted;
      saveStats();
    }

    checkAchievements();
    syncXpFromAuth();
    updateDerivedStats();
  };

  const syncFromAuth = (expFromAuth: number) => {
    if (stats.value.totalXp !== expFromAuth) {
      stats.value.totalXp = expFromAuth;
      updateDerivedStats();
      saveStats();
    }
  };

  const resetStats = () => {
    stats.value = {
      totalXp: 0,
      level: 1,
      completedLessons: 0,
      completedGames: [],
      unlockedAchievements: [],
      dailyStreak: 0,
      lastLoginDate: null,
      lessonsCompletedThisWeek: 0,
      gamesCompletedThisWeek: 0,
      xpEarnedThisWeek: 0,
      weeklyResetDate: new Date().toDateString(),
    };

    allAchievements.value.forEach((achievement) => {
      achievement.unlocked = false;
      achievement.unlockedDate = null;
    });

    localStorage.removeItem('userStats');
    localStorage.removeItem('userAchievements');
    localStorage.removeItem('newAchievements');
  };

  return {
    stats,
    achievements,
    recentAchievements,
    upcomingAchievements,
    totalLessons,
    totalGames,
    completedGamesCount,
    unlockedAchievementsCount,
    totalAchievements,
    userLevel,
    xpPercentage,
    nextLevelXP,
    addLessonCompleted,
    addGameCompleted,
    addXp,
    getNewAchievements,
    checkAchievements,
    init,
    syncFromAuth,
    resetStats,
  };
});
