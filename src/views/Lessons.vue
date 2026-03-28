<!-- views/Lessons.vue -->
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
        <span class="progress-percent">{{ modulesStore.totalProgress }}%</span>
      </div>
      <div class="progress-bar-global">
        <div
          class="progress-fill"
          :style="{ width: modulesStore.totalProgress + '%' }"
        >
          <div class="progress-glow"></div>
        </div>
      </div>
    </div>

    <!-- Список модулей -->
    <div class="modules-container">
      <div
        v-for="(module, index) in modulesStore.modules"
        :key="module.id"
        class="module-section"
        :class="{ completed: module.completed, locked: module.locked }"
      >
        <div
          class="module-header"
          @click="modulesStore.toggleModule(module.id)"
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
                @click.stop="modulesStore.openGame('variables')"
                title="Поиграй и закрепи знания о переменных!"
              >
                🎮 Играть
              </button>
              <button
                v-if="module.id === 2 && !module.locked"
                class="game-btn"
                @click.stop="modulesStore.openGame('loops')"
                title="Поиграй и закрепи знания о циклах!"
              >
                🎮 Играть
              </button>
              <button
                v-if="module.id === 3 && !module.locked"
                class="game-btn"
                @click.stop="modulesStore.openGame('conditions')"
                title="Поиграй и закрепи знания об условных операторах!"
              >
                🎮 Играть
              </button>
            </div>
            <button class="expand-btn">
              {{ modulesStore.expandedModules.includes(module.id) ? '▲' : '▼' }}
            </button>
          </div>
        </div>

        <transition name="expand">
          <div
            v-if="modulesStore.expandedModules.includes(module.id)"
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
              @click="modulesStore.openLesson(lesson, module)"
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
      v-if="modulesStore.showLessonModal"
      class="lesson-modal"
      @click.self="modulesStore.closeLesson"
    >
      <div class="modal-content">
        <button
          class="modal-close"
          @click="modulesStore.closeLesson"
        >
          ✕
        </button>

        <div class="lesson-content-modal">
          <div class="lesson-header-modal">
            <span class="lesson-icon-large">{{ modulesStore.currentLesson?.icon }}</span>
            <h2>{{ modulesStore.currentLesson?.title }}</h2>
            <div class="lesson-info">
              <span>🎯 {{ modulesStore.currentLesson?.xp }} XP</span>
              <span>⏱️ {{ modulesStore.currentLesson?.duration }} мин</span>
            </div>
          </div>

          <!-- Теоретическая часть -->
          <div
            v-if="modulesStore.currentLesson?.type === 'theory'"
            class="theory-section"
          >
            <div class="theory-content">
              <h3>📖 Что ты узнаешь?</h3>
              <ul>
                <li
                  v-for="point in modulesStore.currentLesson?.content.theoryPoints"
                  :key="point"
                >
                  ✨ {{ point }}
                </li>
              </ul>

              <div class="code-example">
                <h4>💡 Пример кода:</h4>
                <pre><code>{{ modulesStore.currentLesson?.content.codeExample }}</code></pre>
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
            v-else-if="modulesStore.currentLesson?.type === 'test'"
            class="test-section"
          >
            <div v-if="!modulesStore.showTestResults">
              <div class="test-progress">
                Вопрос {{ modulesStore.currentQuestionIndex + 1 }} из
                {{ modulesStore.currentLesson.content.questions.length }}
              </div>

              <div class="test-question">
                <h3>
                  {{
                    modulesStore.currentLesson.content.questions[modulesStore.currentQuestionIndex]
                      .question
                  }}
                </h3>
                <div class="test-options">
                  <div
                    v-for="(option, idx) in modulesStore.currentLesson.content.questions[
                      modulesStore.currentQuestionIndex
                    ].options"
                    :key="idx"
                    class="test-option"
                    :class="{
                      selected: modulesStore.testAnswers[modulesStore.currentQuestionIndex] === idx,
                    }"
                    @click="modulesStore.selectAnswer(idx)"
                  >
                    <span class="option-letter">{{ String.fromCharCode(65 + idx) }}.</span>
                    <span class="option-text">{{ option }}</span>
                  </div>
                </div>
              </div>

              <div class="test-navigation">
                <button
                  v-if="modulesStore.currentQuestionIndex > 0"
                  class="nav-btn"
                  @click="modulesStore.prevQuestion"
                >
                  ← Назад
                </button>
                <button
                  v-if="
                    modulesStore.currentQuestionIndex <
                    modulesStore.currentLesson.content.questions.length - 1
                  "
                  class="nav-btn"
                  @click="modulesStore.nextQuestion"
                  :disabled="
                    modulesStore.testAnswers[modulesStore.currentQuestionIndex] === undefined
                  "
                >
                  Далее →
                </button>
                <button
                  v-else
                  class="submit-test-btn"
                  @click="modulesStore.submitTest"
                  :disabled="modulesStore.testAnswers.some((a) => a === undefined)"
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
                <span class="score-number">{{ modulesStore.getCorrectAnswersCount() }}</span>
                <span class="score-total"
                  >/ {{ modulesStore.currentLesson.content.questions.length }}</span
                >
                <span class="score-percent"
                  >({{
                    Math.round(
                      (modulesStore.getCorrectAnswersCount() /
                        modulesStore.currentLesson.content.questions.length) *
                        100,
                    )
                  }}%)</span
                >
              </div>

              <div class="results-details">
                <div
                  v-for="(result, idx) in modulesStore.testResults"
                  :key="idx"
                  class="result-item"
                  :class="{ correct: result.correct, incorrect: !result.correct }"
                >
                  <div class="result-question">
                    <span class="result-icon">{{ result.correct ? '✅' : '❌' }}</span>
                    <span>{{ modulesStore.currentLesson.content.questions[idx].question }}</span>
                  </div>
                  <div class="result-answer">
                    <span class="your-answer"
                      >Твой ответ: {{ String.fromCharCode(65 + result.userAnswer) }}.
                      {{
                        modulesStore.currentLesson.content.questions[idx].options[result.userAnswer]
                      }}</span
                    >
                    <span
                      v-if="!result.correct"
                      class="correct-answer"
                      >Правильный ответ:
                      {{
                        String.fromCharCode(
                          65 + modulesStore.currentLesson.content.questions[idx].correct,
                        )
                      }}.
                      {{
                        modulesStore.currentLesson.content.questions[idx].options[
                          modulesStore.currentLesson.content.questions[idx].correct
                        ]
                      }}</span
                    >
                  </div>
                </div>
              </div>

              <button
                class="complete-lesson-btn"
                @click="completeTestLesson"
                :disabled="!modulesStore.canCompleteTest()"
              >
                {{
                  modulesStore.canCompleteTest()
                    ? '🎉 Получить XP и продолжить'
                    : '😢 Нужно набрать 70% для прохождения'
                }}
              </button>
            </div>
          </div>

          <!-- Практическая часть -->
          <div
            v-else-if="modulesStore.currentLesson?.type === 'practice'"
            class="practice-section"
          >
            <div class="task-description">
              <h3>🎯 Задание:</h3>
              <p>{{ modulesStore.currentLesson?.content.task }}</p>
            </div>

            <div class="code-editor">
              <div class="editor-header">
                <span>💻 Редактор кода</span>
                <button
                  class="run-code-btn"
                  @click="modulesStore.runPracticeCode"
                >
                  ▶️ Запустить
                </button>
              </div>
              <textarea
                v-model="modulesStore.userCode"
                class="code-input"
                :placeholder="modulesStore.currentLesson?.content.codePlaceholder"
              ></textarea>
            </div>

            <div
              v-if="modulesStore.codeOutput"
              class="code-output"
            >
              <h4>📤 Результат:</h4>
              <pre :class="{ 'error-output': modulesStore.codeOutput.includes('❌') }">{{
                modulesStore.codeOutput
              }}</pre>
            </div>

            <button
              class="check-task-btn"
              @click="handleCheckPractice"
            >
              🔍 Проверить задание
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно игры -->
    <div
      v-if="modulesStore.showGameModal"
      class="game-modal"
      @click.self="modulesStore.closeGame"
    >
      <div class="game-modal-content">
        <button
          class="game-modal-close"
          @click="modulesStore.closeGame"
        >
          ✕
        </button>
        <VariableGame
          v-if="modulesStore.currentGame === 'variables'"
          @complete="handleGameComplete"
        />
        <LoopsGame
          v-else-if="modulesStore.currentGame === 'loops'"
          @complete="handleGameComplete"
        />
        <ConditionsGame
          v-else-if="modulesStore.currentGame === 'conditions'"
          @complete="handleGameComplete"
        />
      </div>
    </div>

    <!-- Поздравление с завершением -->
    <div
      v-if="modulesStore.showCongrats"
      class="congrats-overlay"
      @click="modulesStore.resetCongrats"
    >
      <div class="congrats-card">
        <div class="confetti">🎉</div>
        <h2>🎉 Отлично! 🎉</h2>
        <p>Ты получил {{ modulesStore.lastEarnedXP }} XP!</p>
        <p>Продолжай в том же духе!</p>
        <button @click="modulesStore.resetCongrats">🚀 Продолжить</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ConditionsGame from '@/components/games/ConditionsGame.vue';
import LoopsGame from '@/components/games/LoopsGame.vue';
import VariableGame from '@/components/games/VariableGame.vue';
import { useModulesStore } from '@/stores/modulesStore';
import { useUserStatsStore } from '@/stores/userStatsStore';

const userStatsStore = useUserStatsStore();
const modulesStore = useModulesStore();

// Обработчики
const completeTheoryLesson = async () => {
  const xp = await modulesStore.completeTheoryLesson();
  if (xp > 0 && modulesStore.currentLesson.value) {
    userStatsStore.addLessonCompleted();
    userStatsStore.addXp(xp);
  }
};

const completeTestLesson = async () => {
  if (modulesStore.canCompleteTest()) {
    const xp = await modulesStore.completeTestLesson();
    if (xp > 0 && modulesStore.currentLesson.value) {
      userStatsStore.addLessonCompleted();
      userStatsStore.addXp(xp);
    }
  }
};

const handleCheckPractice = async () => {
  const xp = modulesStore.checkPracticeTask();
  if (xp > 0 && modulesStore.currentLesson.value) {
    userStatsStore.addLessonCompleted();
    userStatsStore.addXp(xp);
  }
};

const handleGameComplete = async (bonusXP: number) => {
  await modulesStore.saveGameResultFromStore(modulesStore.currentGame, bonusXP);
  userStatsStore.addGameCompleted(modulesStore.currentGame, bonusXP);
  modulesStore.closeGame();
};

onMounted(() => {
  modulesStore.init();
});
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
