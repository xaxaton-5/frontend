<!-- components/games/LoopsGame.vue -->
<template>
  <div class="game-container">
    <div class="game-header">
      <div class="game-title">
        <span class="title-icon">🔄</span>
        <h2>ЦИКЛО-БИТВА</h2>
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
          🐍
        </div>
        <div class="enemy-energy">{{ enemyPower }}%</div>
      </div>
    </div>

    <div class="task-card">
      <div class="question-text">
        <span class="question-icon">🔄</span>
        <span class="question-title">ЗАДАНИЕ {{ currentLevel + 1 }}</span>
      </div>
      <p class="task-text">{{ currentTask.question }}</p>
      <div class="code-block">
        <pre><code>{{ currentTask.codeExample }}</code></pre>
      </div>
    </div>

    <div class="input-area">
      <div class="input-label">
        <span class="label-icon">🔢</span>
        <span>СКОЛЬКО РАЗ ПОВТОРИТЬ?</span>
      </div>
      <div class="input-controls">
        <input
          v-model.number="userAnswer"
          type="number"
          class="answer-input"
          placeholder="?"
          min="1"
          :max="currentTask.maxAnswer || 10"
          :disabled="showResult || battleEnded"
        />
        <button
          class="preview-btn"
          @click="runPreview"
          :disabled="!userAnswer || showResult || battleEnded"
        >
          ▶️
        </button>
      </div>
    </div>

    <div
      class="preview-area"
      v-if="loopPreview.length > 0"
    >
      <div class="preview-header">
        <span>📟 РЕЗУЛЬТАТ ЦИКЛА</span>
      </div>
      <div class="preview-output">
        <div
          v-for="(line, idx) in loopPreview"
          :key="idx"
          class="preview-line"
        >
          {{ line }}
        </div>
      </div>
    </div>

    <button
      class="attack-btn"
      @click="checkAnswer"
      :disabled="!userAnswer || showResult || battleEnded"
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
        <p v-if="gameWon">Ты победил Змея-Цикла и получил {{ finalXP }} XP!</p>
        <p v-else>Змей-Цикл оказался сильнее... Попробуй ещё раз!</p>
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
  complete: [result: { xpEarned: number; completed: boolean }];
}>();

const score = ref(0);
const currentLevel = ref(0);
const lives = ref(3);
const userAnswer = ref<number | null>(null);
const showResult = ref(false);
const battleEnded = ref(false);
const gameWon = ref(false);
const finalXP = ref(0);
const feedback = ref<any>(null);
const loopPreview = ref<string[]>([]);
const isAttacking = ref(false);
const isDamaged = ref(false);
const enemyAttacking = ref(false);
const enemyDamaged = ref(false);
const enemyPower = ref(100);

const tasks = [
  {
    question: 'Робот должен сказать "Привет!" 3 раза. Сколько раз нужно запустить цикл?',
    codeExample: `for(let i = 0; i < ___ ; i++) {
  console.log("Привет!");
}`,
    options: [],
    correct: 3,
    maxAnswer: 10,
    xp: 10,
    preview: (count: number) => {
      const output = ['🚀 Запускаю цикл...'];
      for (let i = 1; i <= count; i++) {
        output.push(`🤖 Привет! (раз ${i})`);
      }
      output.push('✅ Цикл завершён!');
      return output;
    },
  },
  {
    question: 'Робот считает от 1 до 5. Сколько раз нужно повторить действие?',
    codeExample: `for(let i = 1; i <= ___ ; i++) {
  console.log(i);
}`,
    options: [],
    correct: 5,
    maxAnswer: 10,
    xp: 15,
    preview: (count: number) => {
      const output = ['🔢 Начинаю счёт...'];
      for (let i = 1; i <= count; i++) {
        output.push(`📢 ${i}`);
      }
      output.push('✅ Счёт завершён!');
      return output;
    },
  },
  {
    question: 'Робот рисует квадрат. Нужно нарисовать 4 стороны. Сколько раз повторить?',
    codeExample: `for(let i = 0; i < ___ ; i++) {
  drawSide();
}`,
    options: [],
    correct: 4,
    maxAnswer: 10,
    xp: 20,
    preview: (count: number) => {
      const sides = ['⬆️', '➡️', '⬇️', '⬅️'];
      const output = ['📐 Рисую квадрат...'];
      for (let i = 1; i <= count && i <= sides.length; i++) {
        output.push(`${sides[i - 1]} Сторона ${i}`);
      }
      if (count === 4) {
        output.push('✅ Квадрат готов!');
      } else {
        output.push(`❌ Получилось только ${count} сторон...`);
      }
      return output;
    },
  },
  {
    question:
      'Робот собирает 8 яблок. Каждый раз он собирает 2 яблока. Сколько раз нужно повторить?',
    codeExample: `let apples = 0;
for(let i = 0; i < ___ ; i++) {
  apples += 2;
  console.log("Собрано яблок: " + apples);
}`,
    options: [],
    correct: 4,
    maxAnswer: 10,
    xp: 25,
    preview: (count: number) => {
      const output = ['🍎 Начинаю сбор яблок...'];
      let total = 0;
      for (let i = 1; i <= count; i++) {
        total += 2;
        output.push(`🍎 Собрал 2 яблока (всего: ${total})`);
      }
      if (total === 8) {
        output.push('🎉 Собрано 8 яблок! Урожай собран!');
      } else {
        output.push(`😢 Собрано только ${total} яблок из 8...`);
      }
      return output;
    },
  },
];

const currentTask = computed(() => tasks[currentLevel.value]);

const runPreview = () => {
  if (userAnswer.value) {
    loopPreview.value = currentTask.value.preview(userAnswer.value);
  }
};

const checkAnswer = () => {
  if (userAnswer.value === null) return;

  const isCorrect = userAnswer.value === currentTask.value.correct;

  if (isCorrect) {
    isAttacking.value = true;
    setTimeout(() => {
      isAttacking.value = false;
    }, 300);

    score.value += currentTask.value.xp;

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
      message: `ПРАВИЛЬНО! Нужно ${currentTask.value.correct} раз(а)! +${currentTask.value.xp} XP!`,
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

    if (lives.value <= 0) {
      gameWon.value = false;
      battleEnded.value = true;
      return;
    }

    feedback.value = {
      type: 'error',
      icon: '😵',
      message: `НЕВЕРНО! Правильный ответ: ${currentTask.value.correct} раз(а)`,
    };

    showResult.value = true;
    setTimeout(() => {
      resetRound();
    }, 1200);
  }
};

const resetRound = () => {
  userAnswer.value = null;
  showResult.value = false;
  feedback.value = null;
  loopPreview.value = [];
};

const resetGame = () => {
  score.value = 0;
  currentLevel.value = 0;
  lives.value = 3;
  userAnswer.value = null;
  showResult.value = false;
  battleEnded.value = false;
  gameWon.value = false;
  feedback.value = null;
  loopPreview.value = [];
  enemyPower.value = 100;
};

const exitGame = () => {
  emit('complete', { xpEarned: finalXP.value, completed: gameWon.value });
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

.input-area {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 15px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 11px;
  font-weight: bold;
  color: #ffd166;
}

.label-icon {
  font-size: 14px;
}

.input-controls {
  display: flex;
  gap: 10px;
}

.answer-input {
  flex: 1;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 209, 102, 0.5);
  border-radius: 40px;
  color: white;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
}

.answer-input:focus {
  outline: none;
  border-color: #ffd166;
}

.answer-input:disabled {
  opacity: 0.5;
}

.preview-btn {
  width: 44px;
  background: linear-gradient(135deg, #4ecdc4, #6bcb77);
  border: none;
  border-radius: 40px;
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.preview-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-area {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  margin-bottom: 15px;
  overflow: hidden;
}

.preview-header {
  background: rgba(0, 0, 0, 0.5);
  padding: 6px 12px;
  font-size: 10px;
  color: #ffd166;
  text-align: center;
  letter-spacing: 1px;
}

.preview-output {
  padding: 10px;
  max-height: 100px;
  overflow-y: auto;
}

.preview-line {
  font-family: monospace;
  font-size: 11px;
  padding: 3px 0;
  color: #4ecdc4;
  border-left: 2px solid #ffd166;
  padding-left: 8px;
  margin-bottom: 4px;
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
  font-size: 12px;
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

  .robot-sprite {
    font-size: 36px;
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
