<template>
  <div class="guild-detail-page">
    <div
      v-if="isLoading"
      class="state-card"
    >
      Загружаем страницу гильдии...
    </div>

    <div
      v-else-if="errorMessage"
      class="state-card state-card-error"
    >
      <p>{{ errorMessage }}</p>
      <button
        type="button"
        class="secondary-btn"
        @click="fetchGuild"
      >
        Повторить
      </button>
    </div>

    <template v-else-if="guild">
      <section class="guild-hero">
        <div class="guild-heading">
          <div class="guild-emoji">{{ guild.emoji }}</div>
          <div>
            <p class="hero-badge">Страница гильдии</p>
            <h2>{{ guild.name }}</h2>
            <p class="guild-tagline">{{ guild.tagline }}</p>
            <p class="guild-description">{{ guild.description }}</p>
          </div>
        </div>

        <div class="hero-stats">
          <div class="hero-stat-card">
            <span class="hero-stat-number">{{ guild.member_count }}</span>
            <span class="hero-stat-label">участников</span>
          </div>
          <div class="hero-stat-card">
            <span class="hero-stat-number">{{ guild.total_exp }}</span>
            <span class="hero-stat-label">общий опыт гильдии</span>
          </div>
          <div class="hero-stat-card">
            <span class="hero-stat-number">{{ guild.focus }}</span>
            <span class="hero-stat-label">главный фокус</span>
          </div>
        </div>
      </section>

      <section class="topics-card">
        <h3>Темы гильдии</h3>
        <div class="guild-topics">
          <span
            v-for="topic in guild.topics"
            :key="topic"
            class="topic-chip"
          >
            {{ topic }}
          </span>
        </div>
      </section>

      <section class="members-card">
        <div class="section-header">
          <h3>Участники гильдии</h3>
          <router-link
            to="/community/guilds"
            class="back-link"
          >
            ← Ко всем гильдиям
          </router-link>
        </div>

        <div
          v-if="guild.members.length"
          class="members-list"
        >
          <router-link
            v-for="member in guild.members"
            :key="member.id"
            :to="member.id === currentUserId ? '/profile' : `/users/${member.id}`"
            class="member-card"
          >
            <div class="member-avatar">
              {{ member.username.charAt(0).toUpperCase() }}
            </div>
            <div class="member-info">
              <div class="member-name-row">
                <span class="member-name">{{ member.username }}</span>
                <span
                  v-if="member.id === currentUserId"
                  class="you-badge"
                >
                  Ты
                </span>
              </div>
              <span class="member-meta">
                {{ member.is_parent ? '👨‍👩‍👧 Родитель' : '🎮 Ученик' }}
              </span>
            </div>
            <div class="member-exp">
              <span class="exp-value">{{ member.exp }}</span>
              <span class="exp-label">XP</span>
            </div>
          </router-link>
        </div>

        <div
          v-else
          class="empty-card"
        >
          В этой гильдии пока нет участников.
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { guildsService, type GuildDetailResponse } from '@/services/guildsService';
import { useAuthStore } from '@/stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

const guild = ref<GuildDetailResponse | null>(null);
const isLoading = ref(true);
const errorMessage = ref('');

const currentUserId = computed(() => authStore.user?.id);
const guildSlug = computed(() => String(route.params.slug || ''));

const fetchGuild = async () => {
  if (!guildSlug.value) {
    guild.value = null;
    errorMessage.value = 'Гильдия не найдена.';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    guild.value = await guildsService.getGuild(guildSlug.value);
  } catch (error) {
    console.error('Ошибка загрузки страницы гильдии:', error);
    guild.value = null;
    errorMessage.value = 'Не удалось загрузить страницу гильдии.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchGuild);
watch(() => route.params.slug, fetchGuild);
</script>

<style scoped>
.guild-detail-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guild-hero,
.topics-card,
.members-card,
.state-card,
.empty-card {
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
}

.guild-hero {
  padding: 28px;
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.9fr);
  gap: 24px;
}

.guild-heading {
  display: flex;
  gap: 18px;
  align-items: flex-start;
}

.guild-emoji {
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  flex-shrink: 0;
}

.hero-badge {
  display: inline-flex;
  margin-bottom: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff4bf;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.guild-hero h2,
.topics-card h3,
.members-card h3 {
  color: white;
}

.guild-hero h2 {
  font-size: 34px;
  margin-bottom: 10px;
}

.guild-tagline {
  color: #ffd166;
  font-weight: 700;
  margin-bottom: 10px;
}

.guild-description {
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.6;
}

.hero-stats {
  display: grid;
  gap: 14px;
}

.hero-stat-card {
  border-radius: 22px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.hero-stat-number {
  display: block;
  color: #ffd166;
  font-size: 30px;
  font-weight: 800;
}

.hero-stat-label {
  display: block;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.75);
}

.topics-card,
.members-card,
.state-card,
.empty-card {
  padding: 24px;
}

.guild-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.topic-chip {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 13px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.back-link {
  color: #ffd166;
  text-decoration: none;
  font-weight: 700;
}

.members-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.member-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.member-card:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.11);
}

.member-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 20px;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.member-name {
  color: white;
  font-weight: 700;
}

.member-meta {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.member-exp {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #ffd166;
  font-weight: 800;
}

.exp-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.you-badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: #ffd166;
  color: #5a3e2b;
  font-size: 11px;
  font-weight: 700;
}

.state-card,
.empty-card {
  color: white;
}

.state-card-error {
  background: rgba(255, 107, 107, 0.16);
}

.secondary-btn {
  margin-top: 14px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .guild-hero {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .guild-heading {
    flex-direction: column;
  }

  .guild-hero h2 {
    font-size: 28px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .member-card {
    align-items: flex-start;
  }
}
</style>
