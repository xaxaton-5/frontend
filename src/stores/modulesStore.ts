// stores/modulesStore.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import {
  modules as initialModules,
  updateModuleProgress as updateProgress,
  unlockNextLesson as unlockNext,
  getTotalProgress as getTotal,
} from '@/data/modules';
import { resultsService } from '@/services/resultsService';
import type { UserResult } from '@/services/resultsService';

export const useModulesStore = defineStore('modules', () => {
  // Состояние
  const modules = ref(initialModules);
  const expandedModules = ref<number[]>([1]);
  const currentLesson = ref<any>(null);
  const currentModule = ref<any>(null);
  const showLessonModal = ref(false);
  const userCode = ref('');
  const codeOutput = ref('');
  const showCongrats = ref(false);
  const lastEarnedXP = ref(0);
  const completedResults = ref<Set<string>>(new Set()); // Хранит keys пройденных уроков
  const isLoadingResults = ref(false);

  // Состояние для тестов
  const testAnswers = ref<number[]>([]);
  const testResults = ref<{ correct: boolean; userAnswer: number }[]>([]);
  const currentQuestionIndex = ref(0);
  const showTestResults = ref(false);

  // Состояние для игр
  const showGameModal = ref(false);
  const currentGame = ref('');

  // Геттеры
  const totalProgress = computed(() => getTotal());

  // Генерация уникального ключа для урока
  const getLessonKey = (moduleId: number, lessonId: number, lessonType: string): string => {
    return `lesson_${moduleId}_${lessonId}_${lessonType}`;
  };

  // Генерация ключа для игры
  const getGameKey = (gameType: string): string => {
    return `game_${gameType}`;
  };

  // Загрузка результатов пользователя
  const loadUserResults = async () => {
    isLoadingResults.value = true;
    try {
      const results = await resultsService.getUserResults();
      // Создаем Set из ключей пройденных уроков
      const completedSet = new Set<string>();
      results.forEach((result) => {
        completedSet.add(result.key);
      });
      completedResults.value = completedSet;

      // Синхронизируем статус уроков с полученными результатами
      syncLessonsWithResults();
    } catch (error) {
      console.error('Ошибка загрузки результатов:', error);
    } finally {
      isLoadingResults.value = false;
    }
  };

  // Синхронизация уроков с загруженными результатами
  const syncLessonsWithResults = () => {
    modules.value.forEach((module) => {
      module.lessons.forEach((lesson) => {
        const key = getLessonKey(module.id, lesson.id, lesson.type);
        if (completedResults.value.has(key) && !lesson.completed) {
          lesson.completed = true;
          // Если урок пройден, разблокируем следующий
          const currentIndex = module.lessons.findIndex((l) => l.id === lesson.id);
          const nextLesson = module.lessons[currentIndex + 1];
          if (nextLesson) {
            nextLesson.locked = false;
          }
        }
      });
      // Обновляем прогресс модуля
      updateProgress(module);
    });
  };

  // Сохранение результата урока
  const saveLessonResult = async (lesson: any, moduleId: number, xpEarned: number) => {
    const key = getLessonKey(moduleId, lesson.id, lesson.type);

    // Проверяем, не сохранен ли уже результат
    if (completedResults.value.has(key)) {
      return;
    }

    try {
      await resultsService.saveResult({
        key,
        result_type: lesson.type,
        exp_earned: xpEarned,
      });
      completedResults.value.add(key);
    } catch (error) {
      console.error('Ошибка сохранения результата:', error);
    }
  };

  // Сохранение результата игры
  const saveGameResult = async (gameType: string, xpEarned: number) => {
    const key = getGameKey(gameType);

    if (completedResults.value.has(key)) {
      return;
    }

    try {
      await resultsService.saveResult({
        key,
        result_type: 'game',
        exp_earned: xpEarned,
      });
      completedResults.value.add(key);
    } catch (error) {
      console.error('Ошибка сохранения результата игры:', error);
    }
  };

  // Проверка, пройден ли урок
  const isLessonCompleted = (moduleId: number, lessonId: number, lessonType: string): boolean => {
    const key = getLessonKey(moduleId, lessonId, lessonType);
    return completedResults.value.has(key);
  };

  // Проверка, пройдена ли игра
  const isGameCompleted = (gameType: string): boolean => {
    const key = getGameKey(gameType);
    return completedResults.value.has(key);
  };

  // Методы для работы с модулями
  const toggleModule = (moduleId: number) => {
    const index = expandedModules.value.indexOf(moduleId);
    if (index > -1) {
      expandedModules.value.splice(index, 1);
    } else {
      expandedModules.value.push(moduleId);
    }
  };

  const openLesson = (lesson: any, module: any) => {
    if (lesson.locked) {
      alert('🔒 Сначала пройди предыдущие уроки!');
      return;
    }
    currentLesson.value = lesson;
    currentModule.value = module;
    showLessonModal.value = true;

    if (lesson.type === 'test') {
      testAnswers.value = new Array(lesson.content.questions.length).fill(undefined);
      testResults.value = [];
      currentQuestionIndex.value = 0;
      showTestResults.value = false;
    } else if (lesson.type === 'practice') {
      userCode.value = lesson.content.codePlaceholder || '';
      codeOutput.value = '';
    }
  };

  const closeLesson = () => {
    showLessonModal.value = false;
    currentLesson.value = null;
    currentModule.value = null;
    userCode.value = '';
    codeOutput.value = '';
    testAnswers.value = [];
    testResults.value = [];
    currentQuestionIndex.value = 0;
    showTestResults.value = false;
  };

  const completeTheoryLesson = async () => {
    if (currentLesson.value && !currentLesson.value.completed) {
      currentLesson.value.completed = true;
      const xp = currentLesson.value.xp;
      console.log('completeTheoryLesson: урок пройден, XP =', xp);
      lastEarnedXP.value = xp;
      showCongrats.value = true;

      await saveLessonResult(currentLesson.value, currentModule.value!.id, xp);
      updateProgress(currentModule.value!);
      unlockNext(currentModule.value!, currentLesson.value.id);

      setTimeout(() => {
        closeLesson();
      }, 1500);

      return xp;
    }
    console.log('completeTheoryLesson: урок уже пройден или отсутствует');
    return 0;
  };

  const completeTestLesson = async () => {
    if (currentLesson.value && !currentLesson.value.completed) {
      currentLesson.value.completed = true;
      const xp = currentLesson.value.xp;
      lastEarnedXP.value = xp;
      showCongrats.value = true;

      await saveLessonResult(currentLesson.value, currentModule.value!.id, xp);

      updateProgress(currentModule.value!);
      unlockNext(currentModule.value!, currentLesson.value.id);

      setTimeout(() => {
        closeLesson();
      }, 1500);

      return xp;
    }
    return 0;
  };

  const completePracticeLesson = async () => {
    if (currentLesson.value && !currentLesson.value.completed) {
      currentLesson.value.completed = true;
      const xp = currentLesson.value.xp;
      lastEarnedXP.value = xp;
      showCongrats.value = true;

      await saveLessonResult(currentLesson.value, currentModule.value!.id, xp);

      updateProgress(currentModule.value!);
      unlockNext(currentModule.value!, currentLesson.value.id);

      setTimeout(() => {
        closeLesson();
      }, 1500);

      return xp;
    }
    return 0;
  };

  // Методы для тестов
  const selectAnswer = (answerIndex: number) => {
    testAnswers.value[currentQuestionIndex.value] = answerIndex;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex.value < currentLesson.value!.content.questions.length - 1) {
      currentQuestionIndex.value++;
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex.value > 0) {
      currentQuestionIndex.value--;
    }
  };

  const submitTest = () => {
    testResults.value = currentLesson.value!.content.questions.map((q: any, idx: number) => ({
      correct: testAnswers.value[idx] === q.correct,
      userAnswer: testAnswers.value[idx],
    }));

    showTestResults.value = true;
  };

  const getCorrectAnswersCount = () => {
    return testResults.value.filter((r) => r.correct).length;
  };

  const canCompleteTest = () => {
    const total = currentLesson.value?.content?.questions?.length || 0;
    const correct = getCorrectAnswersCount();
    return total > 0 && correct >= Math.ceil(total * 0.7);
  };

  // Методы для практики
  const runPracticeCode = () => {
    try {
      const consoleLogs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          consoleLogs.push(args.map((arg) => String(arg)).join(' '));
        },
      };

      const executeCode = new Function('console', userCode.value);
      executeCode(mockConsole);

      codeOutput.value = `> Выполнение кода...\n\n📝 Вывод:\n${consoleLogs.join('\n') || '(нет вывода)'}\n\n✅ Код выполнен успешно!`;
    } catch (error: any) {
      codeOutput.value = `❌ Ошибка выполнения:\n${error.message}\n\n💡 Проверь синтаксис кода!`;
    }
  };

  const checkPracticeTask = () => {
    const checkFunction = currentLesson.value?.content.checkFunction;

    if (checkFunction && checkFunction(userCode.value)) {
      codeOutput.value =
        '✅ Отлично! Задание выполнено правильно!\n\n🎉 Ты получаешь XP за прохождение урока!';
      const xp = completePracticeLesson();
      return xp;
    } else {
      const task = currentLesson.value?.content.task || '';
      let hint = 'Проверь правильность написания кода и синтаксис';
      if (task.includes('myName')) {
        hint = 'Создай переменную myName и выведи её через console.log(myName)';
      } else if (task.includes('цикл')) {
        hint = 'Используй for или while цикл с правильными условиями';
      } else if (task.includes('возраст')) {
        hint = 'Создай переменную age и используй if/else для проверки';
      } else if (task.includes('баллам')) {
        hint = 'Используй if/else if/else для проверки разных диапазонов баллов';
      }
      codeOutput.value = `❌ Задание выполнено неверно. Попробуй ещё раз!\n\n💡 Подсказка: ${hint}`;
      return 0;
    }
  };

  // Методы для игр
  const openGame = (gameType: string) => {
    currentGame.value = gameType;
    showGameModal.value = true;
  };

  const closeGame = () => {
    showGameModal.value = false;
    currentGame.value = '';
  };

  const saveGameResultFromStore = async (gameType: string, xpEarned: number) => {
    await saveGameResult(gameType, xpEarned);
  };

  const resetCongrats = () => {
    showCongrats.value = false;
    lastEarnedXP.value = 0;
  };

  // Сохранение прогресса в localStorage (как резервное копирование)
  const saveProgress = () => {
    const modulesData = modules.value.map((m) => ({
      id: m.id,
      progress: m.progress,
      completed: m.completed,
      locked: m.locked,
      lessons: m.lessons.map((l) => ({
        id: l.id,
        completed: l.completed,
        locked: l.locked,
      })),
    }));
    localStorage.setItem('modulesProgress', JSON.stringify(modulesData));
  };

  const loadProgress = () => {
    const saved = localStorage.getItem('modulesProgress');
    if (saved) {
      const savedData = JSON.parse(saved);
      savedData.forEach((savedModule: any) => {
        const module = modules.value.find((m) => m.id === savedModule.id);
        if (module) {
          module.progress = savedModule.progress;
          module.completed = savedModule.completed;
          module.locked = savedModule.locked;

          savedModule.lessons.forEach((savedLesson: any) => {
            const lesson = module.lessons.find((l) => l.id === savedLesson.id);
            if (lesson) {
              lesson.completed = savedLesson.completed;
              lesson.locked = savedLesson.locked;
            }
          });
        }
      });
    }
  };

  // Инициализация
  const init = async () => {
    loadProgress();
    await loadUserResults();
  };

  return {
    // Состояние
    modules,
    expandedModules,
    currentLesson,
    currentModule,
    showLessonModal,
    userCode,
    codeOutput,
    showCongrats,
    lastEarnedXP,
    testAnswers,
    testResults,
    currentQuestionIndex,
    showTestResults,
    showGameModal,
    currentGame,
    isLoadingResults,

    // Геттеры
    totalProgress,
    getCorrectAnswersCount,
    canCompleteTest,
    isLessonCompleted,
    isGameCompleted,

    // Методы
    toggleModule,
    openLesson,
    closeLesson,
    completeTheoryLesson,
    completeTestLesson,
    completePracticeLesson,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitTest,
    runPracticeCode,
    checkPracticeTask,
    openGame,
    closeGame,
    saveGameResultFromStore,
    resetCongrats,
    saveProgress,
    loadProgress,
    init,
    saveLessonResult,
    saveGameResult,
  };
});
