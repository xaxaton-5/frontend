// stores/modulesStore.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import {
  modules as initialModules,
  updateModuleProgress as updateProgress,
  unlockNextLesson as unlockNext,
  getTotalProgress as getTotal,
} from '@/data/modules';

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

  const getCorrectAnswersCount = () => {
    return testResults.value.filter((r) => r.correct).length;
  };

  const canCompleteTest = () => {
    const total = currentLesson.value?.content?.questions?.length || 0;
    const correct = getCorrectAnswersCount();
    return total > 0 && correct >= Math.ceil(total * 0.7);
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

  const completeTheoryLesson = () => {
    if (currentLesson.value && !currentLesson.value.completed) {
      currentLesson.value.completed = true;
      const xp = currentLesson.value.xp;
      lastEarnedXP.value = xp;
      showCongrats.value = true;

      // Обновляем прогресс модуля
      updateProgress(currentModule.value);

      // Разблокируем следующий урок
      unlockNext(currentModule.value, currentLesson.value.id);

      // Закрываем модалку через 1.5 секунды
      setTimeout(() => {
        closeLesson();
      }, 1500);

      return xp;
    }
    return 0;
  };

  const completeTestLesson = () => {
    if (currentLesson.value && !currentLesson.value.completed) {
      currentLesson.value.completed = true;
      const xp = currentLesson.value.xp;
      lastEarnedXP.value = xp;
      showCongrats.value = true;

      updateProgress(currentModule.value);
      unlockNext(currentModule.value, currentLesson.value.id);

      setTimeout(() => {
        closeLesson();
      }, 1500);

      return xp;
    }
    return 0;
  };

  const completePracticeLesson = () => {
    if (currentLesson.value && !currentLesson.value.completed) {
      currentLesson.value.completed = true;
      const xp = currentLesson.value.xp;
      lastEarnedXP.value = xp;
      showCongrats.value = true;

      updateProgress(currentModule.value);
      unlockNext(currentModule.value, currentLesson.value.id);

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

  const resetCongrats = () => {
    showCongrats.value = false;
    lastEarnedXP.value = 0;
  };

  // Сохранение прогресса в localStorage
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
  const init = () => {
    loadProgress();
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

    // Геттеры
    totalProgress,
    getCorrectAnswersCount,
    canCompleteTest,

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
    resetCongrats,
    saveProgress,
    loadProgress,
    init,
  };
});
