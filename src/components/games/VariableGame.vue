<!-- components/games/VariableGame.vue -->
<template>
  <div class="game-container">
    <div class="game-header">
      <div class="game-title">
        <span class="title-icon">📦</span>
        <h2>ПЕРЕМЕННАЯ БИТВА</h2>
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
          🕷️
        </div>
        <div class="enemy-energy">{{ enemyPower }}%</div>
      </div>
    </div>

    <div class="task-card">
      <div class="question-text">
        <span class="question-icon">📦</span>
        <span class="question-title">ЗАДАНИЕ {{ currentLevel + 1 }}</span>
      </div>
      <p class="task-text">{{ currentTask.question }}</p>
      <div class="code-block">
        <pre><code>{{ currentTask.codeExample }}</code></pre>
      </div>
    </div>

    <div class="variables-area">
      <div class="variable-slot">
        <div class="slot-label">
          <span class="label-icon">🏷️</span>
          <span>ИМЯ ПЕРЕМЕННОЙ</span>
        </div>
        <div
          class="drop-zone"
          :class="{ filled: nameSlot.filled, correct: nameSlot.correct, wrong: nameSlot.wrong }"
          @dragover.prevent
          @drop="dropOnName"
        >
          <span v-if="nameSlot.filled">{{ nameSlot.value }}</span>
          <span
            v-else
            class="placeholder"
            >___</span
          >
          <button
            v-if="nameSlot.filled"
            class="clear-btn"
            @click.stop="clearNameSlot"
          >
            ✕
          </button>
        </div>
      </div>

      <div class="variable-slot">
        <div class="slot-label">
          <span class="label-icon">💾</span>
          <span>ЗНАЧЕНИЕ</span>
        </div>
        <div
          class="drop-zone"
          :class="{ filled: valueSlot.filled, correct: valueSlot.correct, wrong: valueSlot.wrong }"
          @dragover.prevent
          @drop="dropOnValue"
        >
          <span v-if="valueSlot.filled">{{ valueSlot.value }}</span>
          <span
            v-else
            class="placeholder"
            >___</span
          >
          <button
            v-if="valueSlot.filled"
            class="clear-btn"
            @click.stop="clearValueSlot"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <div class="words-pool">
      <div class="pool-header">
        <span class="pool-icon">📚</span>
        <span>ДОСТУПНЫЕ СЛОВА</span>
      </div>
      <div class="words-list">
        <div
          v-for="word in availableWords"
          :key="word"
          class="word-card"
          draggable="true"
          @dragstart="dragStart($event, word)"
        >
          {{ word }}
        </div>
      </div>
    </div>

    <button
      class="attack-btn"
      @click="checkAnswer"
      :disabled="!isFilled || showResult || battleEnded"
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
        <p v-if="gameWon">Ты победил Головолом-бота и получил {{ finalXP }} XP!</p>
        <p v-else>Головолом-бот оказался сильнее... Попробуй ещё раз!</p>
        <div style="text-align: center;">
          <div class="mascot-container">
            <template v-if="gameWon">
              <img :src="mascotImage3" alt="Робот-маскот" class="mascot-image" />
              <div class="speech-bubble">Ты справился!</div>
            </template>
            <template v-else>
              <img :src="mascotImage2" alt="Робот-маскот" class="mascot-image" />
              <div class="speech-bubble">Ой-ой!</div>
            </template>
          </div>
        </div>
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
import mascotImage2 from '@/assets/images/8.png'
import mascotImage3 from '@/assets/images/3.png'
import { ref, computed } from 'vue';

const emit = defineEmits<{
  complete: [result: { xpEarned: number; completed: boolean }];
}>();

const score = ref(0);
const currentLevel = ref(0);
const lives = ref(3);
const showResult = ref(false);
const battleEnded = ref(false);
const gameWon = ref(false);
const finalXP = ref(0);
const feedback = ref<any>(null);
const isAttacking = ref(false);
const isDamaged = ref(false);
const enemyAttacking = ref(false);
const enemyDamaged = ref(false);
const enemyPower = ref(100);

let draggedWord: string | null = null;

const nameSlot = ref({
  filled: false,
  value: '',
  correct: false,
  wrong: false,
});

const valueSlot = ref({
  filled: false,
  value: '',
  correct: false,
  wrong: false,
});

const tasks = [
  {
    question: 'Создай переменную "playerName" со значением "Алекс"',
    codeExample: `let ___ = ___ ;`,
    correctName: 'playerName',
    correctValue: '"Алекс"',
    words: ['playerName', '"Алекс"', 'age', '"Маша"', 'score'],
    xp: 10,
  },
  {
    question: 'Создай переменную "age" со значением 12',
    codeExample: `let ___ = ___ ;`,
    correctName: 'age',
    correctValue: '12',
    words: ['age', '12', 'playerName', '15', 'score'],
    xp: 15,
  },
  {
    question: 'Создай переменную "isStudent" со значением true',
    codeExample: `let ___ = ___ ;`,
    correctName: 'isStudent',
    correctValue: 'true',
    words: ['isStudent', 'true', 'false', 'name', 'age'],
    xp: 20,
  },
  {
    question: 'Создай переменную "score" со значением 100',
    codeExample: `let ___ = ___ ;`,
    correctName: 'score',
    correctValue: '100',
    words: ['score', '100', 'points', '50', 'total'],
    xp: 25,
  },
];

const currentTask = computed(() => tasks[currentLevel.value]);

const availableWords = computed(() => {
  const usedWords: string[] = [];
  if (nameSlot.value.filled) usedWords.push(nameSlot.value.value);
  if (valueSlot.value.filled) usedWords.push(valueSlot.value.value);
  return currentTask.value.words.filter((w) => !usedWords.includes(w));
});

const isFilled = computed(() => {
  return nameSlot.value.filled && valueSlot.value.filled;
});

const dragStart = (event: DragEvent, word: string) => {
  draggedWord = word;
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', word);
    event.dataTransfer.effectAllowed = 'copy';
  }
};

const dropOnName = (event: DragEvent) => {
  event.preventDefault();
  if (!draggedWord) return;

  nameSlot.value.filled = true;
  nameSlot.value.value = draggedWord;
  nameSlot.value.correct = false;
  nameSlot.value.wrong = false;
  draggedWord = null;
};

const dropOnValue = (event: DragEvent) => {
  event.preventDefault();
  if (!draggedWord) return;

  valueSlot.value.filled = true;
  valueSlot.value.value = draggedWord;
  valueSlot.value.correct = false;
  valueSlot.value.wrong = false;
  draggedWord = null;
};

const clearNameSlot = () => {
  nameSlot.value.filled = false;
  nameSlot.value.value = '';
  nameSlot.value.correct = false;
  nameSlot.value.wrong = false;
  if (feedback.value) feedback.value = null;
};

const clearValueSlot = () => {
  valueSlot.value.filled = false;
  valueSlot.value.value = '';
  valueSlot.value.correct = false;
  valueSlot.value.wrong = false;
  if (feedback.value) feedback.value = null;
};

const checkAnswer = () => {
  if (!isFilled.value) return;

  const nameCorrect = nameSlot.value.value === currentTask.value.correctName;
  const valueCorrect = valueSlot.value.value === currentTask.value.correctValue;

  nameSlot.value.correct = nameCorrect;
  nameSlot.value.wrong = !nameCorrect;
  valueSlot.value.correct = valueCorrect;
  valueSlot.value.wrong = !valueCorrect;

  if (nameCorrect && valueCorrect) {
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
      message: `ПРАВИЛЬНО! +${currentTask.value.xp} XP!`,
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
      message: `НЕВЕРНО! Правильно: ${currentTask.value.correctName} = ${currentTask.value.correctValue}`,
    };

    showResult.value = true;
    setTimeout(() => {
      resetRound();
    }, 1200);
  }
};

const resetRound = () => {
  nameSlot.value = { filled: false, value: '', correct: false, wrong: false };
  valueSlot.value = { filled: false, value: '', correct: false, wrong: false };
  showResult.value = false;
  feedback.value = null;
  draggedWord = null;
};

const resetGame = () => {
  score.value = 0;
  currentLevel.value = 0;
  lives.value = 3;
  showResult.value = false;
  battleEnded.value = false;
  gameWon.value = false;
  feedback.value = null;
  enemyPower.value = 100;
  resetRound();
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
  text-align: center;
}

.variables-area {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.variable-slot {
  flex: 1;
}

.slot-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: bold;
  color: #ffd166;
}

.label-icon {
  font-size: 12px;
}

.drop-zone {
  position: relative;
  background: rgba(0, 0, 0, 0.4);
  border: 2px dashed rgba(255, 209, 102, 0.5);
  border-radius: 12px;
  padding: 12px 30px 12px 12px;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-zone.filled {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid #ffd166;
}

.drop-zone.correct {
  background: rgba(107, 203, 119, 0.2);
  border-color: #6bcb77;
}

.drop-zone.wrong {
  background: rgba(255, 71, 87, 0.2);
  border-color: #ff4757;
}

.placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  font-size: 12px;
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.5);
}

.words-pool {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 12px;
  margin-bottom: 15px;
}

.pool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 11px;
  font-weight: bold;
  color: #ffd166;
}

.pool-icon {
  font-size: 14px;
}

.words-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.word-card {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  padding: 8px 16px;
  border-radius: 40px;
  cursor: grab;
  user-select: none;
  transition: all 0.2s ease;
  font-weight: bold;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.word-card:active {
  cursor: grabbing;
}

.word-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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

  .variables-area {
    flex-direction: column;
    gap: 12px;
  }

  .robot-sprite {
    font-size: 36px;
  }

  .task-text {
    font-size: 12px;
  }

  .word-card {
    padding: 6px 12px;
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

.mascot-container {
  position: relative;
  display: inline-block;
  margin: 20px 0;
}

.mascot-image {
  width: 150px;
  height: auto;
  animation: bounce 2s infinite;
}

.speech-bubble {
  position: absolute;
  top: -30px;
  right: -50px;
  background: white;
  padding: 8px 15px;
  border-radius: 20px;
  color: #5a3e2b;
  font-weight: bold;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 20px;
  border-width: 8px 8px 0 8px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}
</style>
