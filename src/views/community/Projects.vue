<!-- views/community/Projects.vue -->
<template>
  <div>
    <div class="projects-header">
      <button
        class="share-project-btn"
        @click="showShareModal = true"
      >
        📤 Поделиться проектом
      </button>
    </div>

    <div class="projects-grid">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        @click="viewProject(project)"
      >
        <div class="project-preview">
          <div class="project-code-preview">
            <pre><code>{{ project.codeSnippet }}</code></pre>
          </div>
          <div class="project-overlay">
            <span>👁️ Посмотреть</span>
          </div>
        </div>
        <div class="project-info">
          <div class="project-author">
            <img
              :src="project.authorAvatar"
              alt="Author"
            />
            <span>{{ project.author }}</span>
          </div>
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
          <div class="project-stats">
            <span>❤️ {{ project.likes }}</span>
            <span>💬 {{ project.comments }}</span>
            <span>👁️ {{ project.views }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для проекта -->
    <div
      v-if="selectedProject"
      class="project-modal"
      @click.self="selectedProject = null"
    >
      <div class="project-modal-content">
        <button
          class="modal-close"
          @click="selectedProject = null"
        >
          ✕
        </button>
        <h2>{{ selectedProject.title }}</h2>
        <div class="project-author-modal">
          <img
            :src="selectedProject.authorAvatar"
            alt="Author"
          />
          <span>{{ selectedProject.author }}</span>
        </div>
        <div class="project-code-full">
          <pre><code>{{ selectedProject.codeSnippet }}</code></pre>
        </div>
        <div class="project-description">
          <h3>Описание:</h3>
          <p>{{ selectedProject.description }}</p>
        </div>
        <div class="project-actions">
          <button
            class="like-btn"
            @click="likeProject"
          >
            ❤️ {{ selectedProject.likes }}
          </button>
          <button class="comment-btn">💬 Комментировать</button>
          <button class="run-btn">▶️ Запустить код</button>
        </div>
      </div>
    </div>

    <!-- Модальное окно для шаринга проекта -->
    <div
      v-if="showShareModal"
      class="share-modal"
      @click.self="showShareModal = false"
    >
      <div class="share-modal-content">
        <h2>📤 Поделиться проектом</h2>
        <input
          v-model="shareTitle"
          placeholder="Название проекта"
        />
        <textarea
          v-model="shareDescription"
          placeholder="Описание проекта"
        ></textarea>
        <textarea
          v-model="shareCode"
          placeholder="Твой код"
        ></textarea>
        <button @click="shareProject">Опубликовать</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const showShareModal = ref(false);
const selectedProject = ref<any>(null);
const shareTitle = ref('');
const shareDescription = ref('');
const shareCode = ref('');

const projects = ref([
  {
    id: 1,
    title: 'Калькулятор',
    author: 'КодоМастер',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CodeMaster',
    description: 'Простой калькулятор на JavaScript',
    codeSnippet: `function calc(a, b, op) {
  if(op === '+') return a + b;
  if(op === '-') return a - b;
}`,
    likes: 15,
    comments: 3,
    views: 128,
  },
  {
    id: 2,
    title: 'Игра "Угадай число"',
    author: 'ХакерКот',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HackerCat',
    description: 'Угадай случайное число от 1 до 100',
    codeSnippet: `let secret = Math.floor(Math.random() * 100) + 1;
let guess = prompt('Угадай число:');`,
    likes: 27,
    comments: 8,
    views: 256,
  },
]);

const viewProject = (project: any) => {
  selectedProject.value = project;
};

const likeProject = () => {
  if (selectedProject.value) {
    selectedProject.value.likes++;
  }
};

const shareProject = () => {
  projects.value.push({
    id: projects.value.length + 1,
    title: shareTitle.value,
    author: authStore.user?.username || 'Аноним',
    authorAvatar: authStore.user?.avatar || '',
    description: shareDescription.value,
    codeSnippet: shareCode.value,
    likes: 0,
    comments: 0,
    views: 0,
  });

  showShareModal.value = false;
  shareTitle.value = '';
  shareDescription.value = '';
  shareCode.value = '';
};
</script>

<style scoped>
.projects-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}

.share-project-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.project-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.project-preview {
  position: relative;
  height: 150px;
  background: #1e1e1e;
  overflow: hidden;
}

.project-code-preview {
  padding: 15px;
  height: 100%;
  overflow: hidden;
}

.project-code-preview pre {
  font-size: 10px;
  line-height: 1.3;
  margin: 0;
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-overlay span {
  color: white;
  font-weight: bold;
}

.project-info {
  padding: 15px;
}

.project-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.project-author img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.project-author span {
  color: #ffd166;
  font-size: 12px;
}

.project-info h3 {
  color: white;
  margin-bottom: 5px;
}

.project-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-bottom: 10px;
}

.project-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

/* Модальные окна */
.project-modal,
.share-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.project-modal-content,
.share-modal-content {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 30px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.project-author-modal {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.project-author-modal img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.project-code-full {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.project-code-full pre {
  margin: 0;
  font-size: 12px;
}

.project-description {
  margin-bottom: 20px;
}

.project-description h3 {
  color: #ffd166;
  margin-bottom: 8px;
}

.project-description p {
  color: white;
}

.project-actions {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.like-btn,
.comment-btn,
.run-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
}

.like-btn {
  background: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.comment-btn {
  background: rgba(255, 209, 102, 0.3);
  color: #ffd166;
}

.run-btn {
  background: rgba(107, 203, 119, 0.3);
  color: #6bcb77;
}

.share-modal-content input,
.share-modal-content textarea {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.share-modal-content textarea {
  min-height: 100px;
}

.share-modal-content button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  border: none;
  border-radius: 50px;
  color: white;
  cursor: pointer;
}

@media (max-width: 768px) {
  .projects-header {
    justify-content: center;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-actions {
    flex-direction: column;
  }
}
</style>
