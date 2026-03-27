<template>
  <div class="lessons-page">
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-emoji">📚</span>
        Твои приключения в мире кода
        <span class="title-emoji">🎮</span>
      </h1>
      <p class="page-subtitle">Выбери урок и начни своё путешествие!</p>
    </div>

    <!-- Прогресс по модулям -->
    <div class="global-progress">
      <div class="progress-info">
        <span>🌟 Общий прогресс</span>
        <span class="progress-percent">{{ totalProgress }}%</span>
      </div>
      <div class="progress-bar-global">
        <div
          class="progress-fill"
          :style="{ width: totalProgress + '%' }"
        >
          <div class="progress-glow"></div>
        </div>
      </div>
    </div>

    <!-- Список модулей -->
    <div class="modules-container">
      <div
        v-for="(module, index) in modules"
        :key="module.id"
        class="module-section"
        :class="{ completed: module.completed, locked: module.locked }"
      >
        <div
          class="module-header"
          @click="toggleModule(module.id)"
        >
          <div class="module-number">
            <span v-if="!module.completed && !module.locked">{{ index + 1 }}</span>
            <span v-else-if="module.completed">✅</span>
            <span v-else>🔒</span>
          </div>
          <div class="module-info">
            <h2>{{ module.title }}</h2>
            <p>{{ module.description }}</p>
          </div>
          <div class="module-stats">
            <div class="module-progress">
              <div
                class="progress-bar-small"
                :style="{ width: module.progress + '%' }"
              ></div>
            </div>
            <span class="module-xp">🎁 {{ module.totalXP }} XP</span>
            <div class="module-actions">
              <button
                v-if="module.id === 1 && !module.locked"
                class="game-btn"
                @click.stop="openGame('variables')"
                title="Поиграй и закрепи знания о переменных!"
              >
                🎮 Играть
              </button>
              <button
                v-if="module.id === 2 && !module.locked"
                class="game-btn"
                @click.stop="openGame('loops')"
                title="Поиграй и закрепи знания о циклах!"
              >
                🎮 Играть
              </button>
              <!-- Внутри module-actions, после других кнопок игр -->
              <button
                v-if="module.id === 3 && !module.locked"
                class="game-btn"
                @click.stop="openGame('conditions')"
                title="Поиграй и закрепи знания об условных операторах!"
              >
                🎮 Играть
              </button>
            </div>
            <button class="expand-btn">
              {{ expandedModules.includes(module.id) ? '▲' : '▼' }}
            </button>
          </div>
        </div>

        <transition name="expand">
          <div
            v-if="expandedModules.includes(module.id)"
            class="lessons-list"
          >
            <div
              v-for="lesson in module.lessons"
              :key="lesson.id"
              class="lesson-card"
              :class="{
                completed: lesson.completed,
                locked: lesson.locked,
              }"
              @click="openLesson(lesson, module)"
            >
              <div class="lesson-icon">{{ lesson.icon }}</div>
              <div class="lesson-content">
                <div class="lesson-header">
                  <h3>{{ lesson.title }}</h3>
                  <span class="lesson-xp">+{{ lesson.xp }} XP</span>
                </div>
                <p>{{ lesson.description }}</p>
                <div class="lesson-meta">
                  <span class="lesson-duration">⏱️ {{ lesson.duration }} мин</span>
                  <span class="lesson-type">{{
                    lesson.type === 'theory'
                      ? '📖 Теория'
                      : lesson.type === 'test'
                        ? '📝 Тест'
                        : '💻 Практика'
                  }}</span>
                </div>
              </div>
              <div class="lesson-status">
                <span
                  v-if="lesson.completed"
                  class="completed-badge"
                  >✅ Пройдено</span
                >
                <span
                  v-else-if="lesson.locked"
                  class="locked-badge"
                  >🔒 Закрыто</span
                >
                <button
                  v-else
                  class="start-btn"
                >
                  Начать →
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Модальное окно урока -->
    <div
      v-if="showLessonModal"
      class="lesson-modal"
      @click.self="closeLesson"
    >
      <div class="modal-content">
        <button
          class="modal-close"
          @click="closeLesson"
        >
          ✕
        </button>

        <div class="lesson-content-modal">
          <div class="lesson-header-modal">
            <span class="lesson-icon-large">{{ currentLesson?.icon }}</span>
            <h2>{{ currentLesson?.title }}</h2>
            <div class="lesson-info">
              <span>🎯 {{ currentLesson?.xp }} XP</span>
              <span>⏱️ {{ currentLesson?.duration }} мин</span>
            </div>
          </div>

          <!-- Теоретическая часть -->
          <div
            v-if="currentLesson?.type === 'theory'"
            class="theory-section"
          >
            <div class="theory-content">
              <h3>📖 Что ты узнаешь?</h3>
              <ul>
                <li
                  v-for="point in currentLesson?.content.theoryPoints"
                  :key="point"
                >
                  ✨ {{ point }}
                </li>
              </ul>

              <div class="code-example">
                <h4>💡 Пример кода:</h4>
                <pre><code>{{ currentLesson?.content.codeExample }}</code></pre>
              </div>
            </div>

            <button
              class="complete-lesson-btn"
              @click="completeTheoryLesson"
            >
              ✅ Понятно! Перейти к тесту
            </button>
          </div>

          <!-- Тестовая часть -->
          <div
            v-else-if="currentLesson?.type === 'test'"
            class="test-section"
          >
            <div v-if="!showTestResults">
              <div class="test-progress">
                Вопрос {{ currentQuestionIndex + 1 }} из
                {{ currentLesson.content.questions.length }}
              </div>

              <div class="test-question">
                <h3>{{ currentLesson.content.questions[currentQuestionIndex].question }}</h3>
                <div class="test-options">
                  <div
                    v-for="(option, idx) in currentLesson.content.questions[currentQuestionIndex]
                      .options"
                    :key="idx"
                    class="test-option"
                    :class="{ selected: testAnswers[currentQuestionIndex] === idx }"
                    @click="selectAnswer(idx)"
                  >
                    <span class="option-letter">{{ String.fromCharCode(65 + idx) }}.</span>
                    <span class="option-text">{{ option }}</span>
                  </div>
                </div>
              </div>

              <div class="test-navigation">
                <button
                  v-if="currentQuestionIndex > 0"
                  class="nav-btn"
                  @click="prevQuestion"
                >
                  ← Назад
                </button>
                <button
                  v-if="currentQuestionIndex < currentLesson.content.questions.length - 1"
                  class="nav-btn"
                  @click="nextQuestion"
                  :disabled="testAnswers[currentQuestionIndex] === undefined"
                >
                  Далее →
                </button>
                <button
                  v-else
                  class="submit-test-btn"
                  @click="submitTest"
                  :disabled="testAnswers.some((a) => a === undefined)"
                >
                  📝 Завершить тест
                </button>
              </div>
            </div>

            <div
              v-else
              class="test-results"
            >
              <h3>📊 Результаты теста</h3>
              <div class="results-score">
                <span class="score-number">{{ correctAnswersCount }}</span>
                <span class="score-total">/ {{ currentLesson.content.questions.length }}</span>
                <span class="score-percent"
                  >({{
                    Math.round(
                      (correctAnswersCount / currentLesson.content.questions.length) * 100,
                    )
                  }}%)</span
                >
              </div>

              <div class="results-details">
                <div
                  v-for="(result, idx) in testResults"
                  :key="idx"
                  class="result-item"
                  :class="{ correct: result.correct, incorrect: !result.correct }"
                >
                  <div class="result-question">
                    <span class="result-icon">{{ result.correct ? '✅' : '❌' }}</span>
                    <span>{{ currentLesson.content.questions[idx].question }}</span>
                  </div>
                  <div class="result-answer">
                    <span class="your-answer"
                      >Твой ответ: {{ String.fromCharCode(65 + result.userAnswer) }}.
                      {{ currentLesson.content.questions[idx].options[result.userAnswer] }}</span
                    >
                    <span
                      v-if="!result.correct"
                      class="correct-answer"
                      >Правильный ответ:
                      {{ String.fromCharCode(65 + currentLesson.content.questions[idx].correct) }}.
                      {{
                        currentLesson.content.questions[idx].options[
                          currentLesson.content.questions[idx].correct
                        ]
                      }}</span
                    >
                  </div>
                </div>
              </div>

              <button
                class="complete-lesson-btn"
                @click="completeTestLesson"
                :disabled="
                  correctAnswersCount < Math.ceil(currentLesson.content.questions.length * 0.7)
                "
              >
                {{
                  correctAnswersCount >= Math.ceil(currentLesson.content.questions.length * 0.7)
                    ? '🎉 Получить XP и продолжить'
                    : '😢 Нужно набрать 70% для прохождения'
                }}
              </button>
            </div>
          </div>

          <!-- Практическая часть -->
          <div
            v-else-if="currentLesson?.type === 'practice'"
            class="practice-section"
          >
            <div class="task-description">
              <h3>🎯 Задание:</h3>
              <p>{{ currentLesson?.content.task }}</p>
            </div>

            <div class="code-editor">
              <div class="editor-header">
                <span>💻 Редактор кода</span>
                <button
                  class="run-code-btn"
                  @click="runPracticeCode"
                >
                  ▶️ Запустить
                </button>
              </div>
              <textarea
                v-model="userCode"
                class="code-input"
                :placeholder="currentLesson?.content.codePlaceholder"
              ></textarea>
            </div>

            <div
              v-if="codeOutput"
              class="code-output"
            >
              <h4>📤 Результат:</h4>
              <pre :class="{ 'error-output': codeOutput.includes('❌') }">{{ codeOutput }}</pre>
            </div>

            <button
              class="check-task-btn"
              @click="checkPracticeTask"
            >
              🔍 Проверить задание
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно игры -->
    <div
      v-if="showGameModal"
      class="game-modal"
      @click.self="closeGame"
    >
      <div class="game-modal-content">
        <button
          class="game-modal-close"
          @click="closeGame"
        >
          ✕
        </button>
        <VariableGame
          v-if="currentGame === 'variables'"
          @complete="handleGameComplete"
        />
        <LoopsGame
          v-else-if="currentGame === 'loops'"
          @complete="handleGameComplete"
        />
        <ConditionsGame
          v-else-if="currentGame === 'conditions'"
          @complete="handleGameComplete"
        />
      </div>
    </div>

    <!-- Поздравление с завершением -->
    <div
      v-if="showCongrats"
      class="congrats-overlay"
      @click="showCongrats = false"
    >
      <div class="congrats-card">
        <div class="confetti">🎉</div>
        <h2>🎉 Отлично! 🎉</h2>
        <p>Ты получил {{ lastEarnedXP }} XP!</p>
        <p>Продолжай в том же духе!</p>
        <button @click="showCongrats = false">🚀 Продолжить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ConditionsGame from '@/components/games/ConditionsGame.vue';
import LoopsGame from '@/components/games/LoopsGame.vue';
import VariableGame from '@/components/games/VariableGame.vue';
import {
  modules as modulesData,
  updateModuleProgress,
  unlockNextLesson,
  getTotalProgress,
} from '@/data/modules';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const expandedModules = ref<number[]>([1]);
const showLessonModal = ref(false);
const currentLesson = ref<any>(null);
const currentModule = ref<any>(null);
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

// Используем импортированные модули
const modules = ref(modulesData);

const totalProgress = computed(() => getTotalProgress());

const correctAnswersCount = computed(() => {
  return testResults.value.filter((r) => r.correct).length;
});

const toggleModule = (moduleId: number) => {
  const index = expandedModules.value.indexOf(moduleId);
  if (index > -1) {
    expandedModules.value.splice(index, 1);
  } else {
    expandedModules.value.push(moduleId);
  }
};

const openLesson = (lesson: any, module: any) => {
  console.log('Opening lesson:', lesson.title);
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
    lastEarnedXP.value = currentLesson.value.xp;
    showCongrats.value = true;

    updateUserXP(currentLesson.value.xp);
    unlockNextLesson(currentModule.value, currentLesson.value.id);

    setTimeout(() => {
      closeLesson();
    }, 1500);
  }
};

const selectAnswer = (answerIndex: number) => {
  testAnswers.value[currentQuestionIndex.value] = answerIndex;
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < currentLesson.value.content.questions.length - 1) {
    currentQuestionIndex.value++;
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

const submitTest = () => {
  testResults.value = currentLesson.value.content.questions.map((q: any, idx: number) => ({
    correct: testAnswers.value[idx] === q.correct,
    userAnswer: testAnswers.value[idx],
  }));

  showTestResults.value = true;
};

const completeTestLesson = () => {
  if (currentLesson.value && !currentLesson.value.completed) {
    currentLesson.value.completed = true;
    lastEarnedXP.value = currentLesson.value.xp;
    showCongrats.value = true;

    updateUserXP(currentLesson.value.xp);
    unlockNextLesson(currentModule.value, currentLesson.value.id);

    setTimeout(() => {
      closeLesson();
    }, 1500);
  }
};

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
    completePracticeLesson();
  } else {
    codeOutput.value =
      '❌ Задание выполнено неверно. Попробуй ещё раз!\n\n💡 Подсказка: ' +
      getHint(currentLesson.value?.content.task);
  }
};

const getHint = (task: string) => {
  if (task?.includes('myName')) {
    return 'Создай переменную myName и выведи её через console.log(myName)';
  }
  if (task?.includes('цикл')) {
    return 'Используй for или while цикл с правильными условиями';
  }
  if (task?.includes('возраст')) {
    return 'Создай переменную age и используй if/else для проверки';
  }
  if (task?.includes('баллам')) {
    return 'Используй if/else if/else для проверки разных диапазонов баллов';
  }
  return 'Проверь правильность написания кода и синтаксис';
};

const completePracticeLesson = () => {
  if (currentLesson.value && !currentLesson.value.completed) {
    currentLesson.value.completed = true;
    lastEarnedXP.value = currentLesson.value.xp;
    showCongrats.value = true;

    updateUserXP(currentLesson.value.xp);
    unlockNextLesson(currentModule.value, currentLesson.value.id);

    setTimeout(() => {
      closeLesson();
    }, 1500);
  }
};

const updateUserXP = (xpAmount: number) => {
  if (authStore.user) {
    authStore.user.xp += xpAmount;
    const newLevel = Math.floor(authStore.user.xp / 1000) + 1;
    if (newLevel > authStore.user.level) {
      authStore.user.level = newLevel;
      alert(`🎉 ПОЗДРАВЛЯЕМ! Ты достиг ${newLevel} уровня! 🎉`);
    }
    localStorage.setItem('user', JSON.stringify(authStore.user));
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

const handleGameComplete = (bonusXP: number) => {
  updateUserXP(bonusXP);
  showGameCompleteNotification(bonusXP);
  closeGame();
};

const showGameCompleteNotification = (bonusXP: number) => {
  const notification = document.createElement('div');
  notification.className = 'game-complete-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-emoji">🎮</span>
      <div>
        <strong>Игра пройдена!</strong>
        <p>Ты получил ${bonusXP} XP!</p>
      </div>
    </div>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 100);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
};
</script>

<style scoped>
.lessons-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 48px;
  color: white;
  text-shadow: 3px 3px 0 #ff6b6b;
  margin-bottom: 15px;
}

.title-emoji {
  font-size: 54px;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
}

.global-progress {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 20px;
  margin-bottom: 40px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  color: white;
  font-weight: bold;
  margin-bottom: 10px;
}

.progress-bar-global {
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd166, #ff6b6b);
  transition: width 0.5s ease;
  position: relative;
  overflow: hidden;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

.modules-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.module-section {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.module-section.completed {
  border: 2px solid #6bcb77;
}

.module-section.locked {
  opacity: 0.6;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.module-header:hover {
  background: rgba(255, 255, 255, 0.1);
}

.module-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.module-info {
  flex: 1;
}

.module-info h2 {
  color: white;
  margin-bottom: 5px;
}

.module-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.module-stats {
  display: flex;
  align-items: center;
  gap: 20px;
}

.module-progress {
  width: 100px;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-small {
  height: 100%;
  background: linear-gradient(90deg, #ffd166, #ff6b6b);
  transition: width 0.3s ease;
}

.module-xp {
  color: #ffd166;
  font-weight: bold;
}

.module-actions {
  display: flex;
  align-items: center;
}

.game-btn {
  background: linear-gradient(135deg, #6bcb77, #4ecdc4);
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.game-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.expand-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  width: 30px;
  height: 30px;
}

.lessons-list {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.lesson-card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lesson-card:hover:not(.locked) {
  transform: translateX(10px);
  background: rgba(255, 255, 255, 0.2);
}

.lesson-card.completed {
  opacity: 0.7;
  background: rgba(107, 203, 119, 0.2);
}

.lesson-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.lesson-icon {
  font-size: 48px;
}

.lesson-content {
  flex: 1;
}

.lesson-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.lesson-header h3 {
  color: white;
  font-size: 18px;
}

.lesson-xp {
  color: #ffd166;
  font-weight: bold;
}

.lesson-content p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-bottom: 8px;
}

.lesson-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.lesson-status {
  min-width: 120px;
  text-align: right;
}

.completed-badge {
  color: #6bcb77;
  font-weight: bold;
}

.locked-badge {
  color: #ff6b6b;
}

.start-btn {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Модальное окно урока */
.lesson-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 30px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 30px;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.lesson-header-modal {
  text-align: center;
  margin-bottom: 30px;
}

.lesson-icon-large {
  font-size: 64px;
  display: block;
  margin-bottom: 10px;
}

.lesson-header-modal h2 {
  color: white;
  margin-bottom: 10px;
}

.lesson-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #ffd166;
  font-weight: bold;
}

.theory-section,
.practice-section {
  margin-top: 20px;
}

.theory-section h3,
.practice-section h3 {
  color: white;
  margin-bottom: 15px;
}

.theory-section ul {
  list-style: none;
  padding: 0;
}

.theory-section li {
  color: white;
  padding: 10px;
  margin: 5px 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.code-example {
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 15px;
}

.code-example h4 {
  color: #ffd166;
  margin-bottom: 10px;
}

pre {
  background: #1e1e1e;
  padding: 15px;
  border-radius: 10px;
  overflow-x: auto;
}

code {
  color: #4ecdc4;
  font-family: monospace;
}

.code-editor {
  margin: 20px 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: white;
}

.code-input {
  width: 100%;
  min-height: 200px;
  background: #1e1e1e;
  color: #4ecdc4;
  border: 2px solid #ffd166;
  border-radius: 10px;
  padding: 15px;
  font-family: monospace;
  font-size: 14px;
}

.run-code-btn,
.check-task-btn,
.complete-lesson-btn {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.run-code-btn:hover,
.check-task-btn:hover,
.complete-lesson-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.code-output {
  margin-top: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 15px;
}

.code-output h4 {
  color: #ffd166;
  margin-bottom: 10px;
}

.code-output pre {
  background: #1e1e1e;
  color: #6bcb77;
}

.error-output {
  color: #ff6b6b !important;
}

/* Стили для тестов */
.test-section {
  margin-top: 20px;
}

.test-progress {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 30px;
  display: inline-block;
  margin-bottom: 20px;
  color: white;
  font-weight: bold;
}

.test-question {
  margin-bottom: 30px;
}

.test-question h3 {
  color: white;
  margin-bottom: 20px;
  font-size: 20px;
}

.test-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.test-option {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
}

.test-option:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.test-option.selected {
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.3), rgba(255, 107, 107, 0.3));
  border-color: #ffd166;
}

.option-letter {
  font-weight: bold;
  font-size: 18px;
  color: #ffd166;
  min-width: 30px;
}

.option-text {
  flex: 1;
}

.test-navigation {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 30px;
}

.nav-btn,
.submit-test-btn {
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover:not(:disabled),
.submit-test-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.nav-btn:disabled,
.submit-test-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-test-btn {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
}

.test-results {
  margin-top: 20px;
}

.test-results h3 {
  color: white;
  margin-bottom: 20px;
}

.results-score {
  text-align: center;
  margin-bottom: 30px;
}

.score-number {
  font-size: 48px;
  font-weight: bold;
  color: #ffd166;
}

.score-total {
  font-size: 32px;
  color: white;
}

.score-percent {
  font-size: 20px;
  color: white;
  margin-left: 10px;
}

.results-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  max-height: 400px;
  overflow-y: auto;
}

.result-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 15px;
}

.result-item.correct {
  border-left: 4px solid #6bcb77;
}

.result-item.incorrect {
  border-left: 4px solid #ff4757;
}

.result-question {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: white;
  font-weight: bold;
}

.result-icon {
  font-size: 20px;
}

.result-answer {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.your-answer {
  display: block;
  margin-bottom: 5px;
}

.correct-answer {
  display: block;
  color: #6bcb77;
}

/* Модальное окно игры */
.game-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.game-modal-content {
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: bounceIn 0.5s ease;
}

.game-modal-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: white;
  z-index: 10;
  transition: all 0.3s ease;
}

.game-modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Поздравление */
.congrats-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.congrats-card {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border-radius: 30px;
  padding: 40px;
  text-align: center;
  animation: bounceIn 0.5s ease;
}

.congrats-card h2 {
  color: white;
  font-size: 36px;
  margin: 20px 0;
}

.congrats-card p {
  color: white;
  font-size: 18px;
  margin: 10px 0;
}

.congrats-card button {
  background: white;
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
  cursor: pointer;
  margin-top: 20px;
}

.confetti {
  font-size: 48px;
  animation: spin 0.5s ease;
}

/* Уведомление о завершении игры */
.game-complete-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  transform: translateX(400px);
  transition: transform 0.3s ease;
}

.game-complete-notification.show {
  transform: translateX(0);
}

.notification-content {
  background: linear-gradient(135deg, #6bcb77, #4ecdc4);
  border-radius: 20px;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  color: white;
  animation: slideInRight 0.3s ease;
}

.notification-emoji {
  font-size: 32px;
}

.notification-content strong {
  font-size: 16px;
  display: block;
  margin-bottom: 4px;
}

.notification-content p {
  font-size: 14px;
  margin: 0;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
