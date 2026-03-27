<!-- components/games/ConditionsGame.vue -->
<template>
  <div class="game-container">
    <div class="game-header">
      <div class="game-title">
        <span class="title-icon">🤖</span>
        <h2>РОБО-БИТВА</h2>
        <span class="title-icon">⚡</span>
      </div>
      <div class="game-stats">
        <div class="stat">
          <span>🏆</span>
          <strong>{{ score }}</strong>
        </div>
        <div class="stat">
          <span>⚡</span>
          <strong>{{ currentLevel + 1 }}/{{ tasks.length }}</strong>
        </div>
        <div class="stat">
          <span>❤️</span>
          <strong>{{ lives }}</strong>
        </div>
      </div>
    </div>

    <div class="battle-arena">
      <div class="hero-robot">
        <div
          class="robot-sprite"
          :class="{ attacking: isAttacking, damaged: isDamaged }"
        >
          🤖
        </div>
        <div class="health-bar">
          <div
            class="health-fill"
            :style="{ width: (lives / 3) * 100 + '%' }"
          ></div>
        </div>
      </div>

      <div class="vs">VS</div>

      <div class="enemy-robot">
        <div
          class="robot-sprite enemy"
          :class="{ attacking: enemyAttacking, damaged: enemyDamaged }"
        >
          👾
        </div>
        <div class="enemy-energy">{{ enemyPower }}%</div>
      </div>
    </div>

    <div class="task-card">
      <div class="question-text">
        <span class="question-icon">❓</span>
        <span class="question-title">ЗАДАНИЕ {{ currentLevel + 1 }}</span>
      </div>
      <p class="task-text">{{ currentTask.question }}</p>
      <div class="code-block">
        <pre><code>{{ currentTask.codeExample }}</code></pre>
      </div>
    </div>

    <div class="options-grid">
      <button
        v-for="(option, idx) in currentTask.options"
        :key="idx"
        class="option-btn"
        :class="{
          selected: selectedOption === idx,
          correct: showResult && idx === currentTask.correct,
          wrong: showResult && selectedOption === idx && idx !== currentTask.correct,
        }"
        @click="selectOption(idx)"
        :disabled="showResult || battleEnded"
      >
        <span class="option-letter">{{ ['A', 'B', 'C', 'D'][idx] }}</span>
        <span class="option-text">{{ option }}</span>
      </button>
    </div>

    <div
      class="battle-log"
      v-if="battleMessage"
    >
      <div
        class="log-message"
        :class="lastMessageType"
      >
        {{ battleMessage }}
      </div>
    </div>

    <button
      class="attack-btn"
      @click="checkAnswer"
      :disabled="selectedOption === null || showResult || battleEnded"
    >
      ⚔️ АТАКОВАТЬ
    </button>

    <div
      v-if="feedback && !battleEnded"
      class="feedback"
      :class="feedback.type"
    >
      <span>{{ feedback.icon }}</span>
      <span>{{ feedback.message }}</span>
    </div>

    <!-- Модальное окно окончания игры -->
    <div
      v-if="battleEnded"
      class="game-over-modal"
    >
      <div class="game-over-card">
        <div class="game-over-icon">{{ gameWon ? '🏆' : '💀' }}</div>
        <h2>{{ gameWon ? 'ПОБЕДА!' : 'ПОРАЖЕНИЕ' }}</h2>
        <p v-if="gameWon">Ты уничтожил Вирус-бота и получил {{ finalXP }} XP!</p>
        <p v-else>Вирус-бот оказался сильнее... Попробуй ещё раз!</p>
        <div class="game-over-buttons">
          <button
            class="restart-btn"
            @click="resetGame"
          >
            🔄 ИГРАТЬ СНОВА
          </button>
          <button
            class="exit-btn"
            @click="exitGame"
          >
            🚪 ЗАВЕРШИТЬ ИГРУ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{
  complete: [score: number];
}>();

const score = ref(0);
const currentLevel = ref(0);
const lives = ref(3);
const selectedOption = ref<number | null>(null);
const showResult = ref(false);
const battleEnded = ref(false);
const gameWon = ref(false);
const finalXP = ref(0);
const feedback = ref<any>(null);
const battleMessage = ref('');
const lastMessageType = ref('');
const isAttacking = ref(false);
const isDamaged = ref(false);
const enemyAttacking = ref(false);
const enemyDamaged = ref(false);
const enemyPower = ref(100);

const tasks = [
  {
    question:
      'Робот проверяет возраст. Если возраст 18 или больше, он говорит "Доступ разрешён", иначе "Доступ запрещён". Какое условие нужно вставить?',
    codeExample: `let age = 20;
if (___ ) {
  console.log("Доступ разрешён");
} else {
  console.log("Доступ запрещён");
}`,
    options: ['age > 18', 'age >= 18', 'age < 18', 'age <= 18'],
    correct: 1,
    xp: 10,
  },
  {
    question:
      'Робот оценивает баллы. Если баллы >= 90 - "Отлично!", если >= 70 - "Хорошо!", иначе - "Нужно учиться!". При 85 баллах какое условие должно быть в if?',
    codeExample: `let score = 85;
if (___ ) {
  console.log("Отлично!");
} else if (score >= 70) {
  console.log("Хорошо!");
} else {
  console.log("Нужно учиться!");
}`,
    options: ['score >= 85', 'score > 90', 'score >= 90', 'score == 90'],
    correct: 2,
    xp: 15,
  },
  {
    question:
      'Робот проверяет, является ли число чётным. Если чётное - "Чётное", иначе - "Нечётное". Какое условие нужно вставить?',
    codeExample: `let number = 7;
if (___ ) {
  console.log("Чётное");
} else {
  console.log("Нечётное");
}`,
    options: ['number % 2 == 0', 'number / 2 == 0', 'number % 2 == 1', 'number * 2 == 0'],
    correct: 0,
    xp: 20,
  },
  {
    question:
      'Робот проверяет температуру. Если температура ниже 0 - "Холодно", если от 0 до 20 - "Нормально", если выше 20 - "Тепло". При температуре 15°C какое условие нужно вставить?',
    codeExample: `let temp = 15;
if (temp < 0) {
  console.log("Холодно");
} else if (___ ) {
  console.log("Нормально");
} else {
  console.log("Тепло");
}`,
    options: ['temp > 20', 'temp <= 20', 'temp >= 0 && temp <= 20', 'temp < 20'],
    correct: 2,
    xp: 25,
  },
];

const currentTask = computed(() => tasks[currentLevel.value]);

const selectOption = (idx: number) => {
  if (!showResult.value && !battleEnded.value) {
    selectedOption.value = idx;
    feedback.value = null;
  }
};

const checkAnswer = () => {
  if (selectedOption.value === null) return;

  const isCorrect = selectedOption.value === currentTask.value.correct;

  if (isCorrect) {
    isAttacking.value = true;
    setTimeout(() => {
      isAttacking.value = false;
    }, 300);

    score.value += 10;
    battleMessage.value = `✅ ВЕРНО! +10 очков!`;
    lastMessageType.value = 'success';

    if (currentLevel.value === tasks.length - 1) {
      gameWon.value = true;
      battleEnded.value = true;
      finalXP.value = score.value + 50;
      return;
    }

    showResult.value = true;
    feedback.value = {
      type: 'success',
      icon: '🎉',
      message: `ПРАВИЛЬНО! +10 очков!`,
    };

    setTimeout(() => {
      currentLevel.value++;
      resetRound();
    }, 1200);
  } else {
    isDamaged.value = true;
    enemyAttacking.value = true;
    setTimeout(() => {
      isDamaged.value = false;
      enemyAttacking.value = false;
    }, 300);

    lives.value--;
    battleMessage.value = `❌ НЕВЕРНО! -1 жизнь`;
    lastMessageType.value = 'error';

    if (lives.value <= 0) {
      gameWon.value = false;
      battleEnded.value = true;
      return;
    }

    feedback.value = {
      type: 'error',
      icon: '😵',
      message: `НЕВЕРНО! Правильно: ${String.fromCharCode(65 + currentTask.value.correct)}. ${currentTask.value.options[currentTask.value.correct]}`,
    };

    showResult.value = true;
    setTimeout(() => {
      resetRound();
    }, 1200);
  }
};

const resetRound = () => {
  selectedOption.value = null;
  showResult.value = false;
  feedback.value = null;
  battleMessage.value = '';
};

const resetGame = () => {
  score.value = 0;
  currentLevel.value = 0;
  lives.value = 3;
  selectedOption.value = null;
  showResult.value = false;
  battleEnded.value = false;
  gameWon.value = false;
  feedback.value = null;
  battleMessage.value = '';
  enemyPower.value = 100;
};

const exitGame = () => {
  emit('complete', finalXP.value);
};
</script>

<style scoped>
.game-container {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 24px;
  padding: 20px;
  color: white;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.game-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.game-title h2 {
  font-size: 20px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.title-icon {
  font-size: 24px;
}

.game-stats {
  display: flex;
  gap: 15px;
}

.stat {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.stat span {
  font-size: 14px;
}

.stat strong {
  font-size: 16px;
  font-weight: bold;
}

.battle-arena {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 40px;
  padding: 15px 20px;
  margin-bottom: 20px;
}

.hero-robot,
.enemy-robot {
  text-align: center;
  flex: 1;
}

.robot-sprite {
  font-size: 48px;
  transition: all 0.1s ease;
}

.robot-sprite.attacking {
  transform: translateX(15px) scale(1.1);
}

.robot-sprite.damaged {
  transform: translateX(-8px) rotate(-5deg);
}

.enemy.attacking {
  transform: translateX(-15px) scale(1.1);
}

.enemy.damaged {
  transform: translateX(8px) rotate(5deg);
}

.health-bar {
  width: 80px;
  height: 6px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  margin-top: 8px;
  overflow: hidden;
}

.health-fill {
  height: 100%;
  background: linear-gradient(90deg, #6bcb77, #4ecdc4);
  transition: width 0.3s ease;
}

.enemy-energy {
  font-size: 11px;
  color: #ff6b6b;
  margin-top: 5px;
}

.vs {
  font-size: 20px;
  font-weight: bold;
  color: #ffd166;
  padding: 0 15px;
}

.task-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 15px;
}

.question-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.question-icon {
  font-size: 16px;
}

.question-title {
  font-size: 12px;
  font-weight: bold;
  color: #ffd166;
  letter-spacing: 1px;
}

.task-text {
  font-size: 13px;
  margin-bottom: 10px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
}

.code-block {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 8px;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  font-family: monospace;
  font-size: 11px;
  color: #4ecdc4;
  white-space: pre-wrap;
  word-break: break-word;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
}

.option-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 12px;
}

.option-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(3px);
}

.option-btn.selected {
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.3), rgba(255, 107, 107, 0.3));
  border-color: #ffd166;
}

.option-btn.correct {
  background: rgba(107, 203, 119, 0.3);
  border-color: #6bcb77;
}

.option-btn.wrong {
  background: rgba(255, 71, 87, 0.3);
  border-color: #ff4757;
}

.option-letter {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  text-align: left;
  font-size: 12px;
}

.battle-log {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 15px;
  text-align: center;
}

.log-message {
  font-size: 12px;
  font-weight: bold;
}

.log-message.success {
  color: #6bcb77;
}

.log-message.error {
  color: #ff6b6b;
}

.attack-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
}

.attack-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 71, 87, 0.4);
}

.attack-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.feedback {
  padding: 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
}

.feedback.success {
  background: rgba(107, 203, 119, 0.2);
  border: 1px solid #6bcb77;
  color: #6bcb77;
}

.feedback.error {
  background: rgba(255, 71, 87, 0.2);
  border: 1px solid #ff4757;
  color: #ff6b6b;
}

/* Модальное окно окончания игры */
.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.game-over-card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 30px;
  padding: 30px;
  text-align: center;
  min-width: 320px;
  border: 2px solid;
  animation: bounceIn 0.3s ease;
}

.game-over-card:has(h2:contains('ПОБЕДА!')) {
  border-color: #6bcb77;
}

.game-over-card:has(h2:contains('ПОРАЖЕНИЕ')) {
  border-color: #ff4757;
}

.game-over-icon {
  font-size: 64px;
  margin-bottom: 15px;
}

.game-over-card h2 {
  font-size: 28px;
  margin-bottom: 10px;
}

.game-over-card p {
  margin-bottom: 25px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.game-over-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.restart-btn,
.exit-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 40px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.restart-btn {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  color: white;
}

.exit-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.restart-btn:hover,
.exit-btn:hover {
  transform: translateY(-2px);
}

@keyframes bounceIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 600px) {
  .game-container {
    padding: 15px;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .robot-sprite {
    font-size: 36px;
  }

  .option-text {
    font-size: 11px;
  }

  .task-text {
    font-size: 12px;
  }

  .game-over-card {
    min-width: 280px;
    padding: 25px;
  }

  .game-over-icon {
    font-size: 48px;
  }

  .game-over-card h2 {
    font-size: 24px;
  }
}
</style>
