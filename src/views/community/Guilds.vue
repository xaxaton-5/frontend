<template>
  <div class="guilds-page">
    <section class="guilds-hero">
      <div>
        <p class="hero-badge">Найди свою команду</p>
        <h2>Сообщества гильдии</h2>
        <p class="hero-text">
          Выбирай гильдию по интересам, участвуй в совместных челленджах и знакомься с
          единомышленниками.
        </p>
      </div>

      <div class="hero-stats">
        <div class="hero-stat-card">
          <span class="hero-stat-number">{{ guilds.length }}</span>
          <span class="hero-stat-label">активных гильдий</span>
        </div>
        <div class="hero-stat-card">
          <span class="hero-stat-number">{{ totalMembers }}</span>
          <span class="hero-stat-label">участников</span>
        </div>
      </div>
    </section>

    <div
      v-if="isLoading"
      class="state-card"
    >
      Загружаем сообщества гильдии...
    </div>

    <div
      v-else-if="errorMessage"
      class="state-card state-card-error"
    >
      <p>{{ errorMessage }}</p>
      <button
        type="button"
        class="secondary-btn"
        @click="fetchGuilds"
      >
        Повторить
      </button>
    </div>

    <div
      v-else-if="successMessage"
      class="state-card state-card-success"
    >
      {{ successMessage }}
    </div>

    <section
      v-if="!isLoading && guilds.length"
      class="guilds-grid"
    >
      <article
        v-for="guild in guilds"
        :key="guild.id"
        class="guild-card"
        :class="{ joined: guild.is_joined }"
      >
        <div class="guild-card-header">
          <span class="guild-emoji">{{ guild.emoji }}</span>
          <div>
            <h3>{{ guild.name }}</h3>
            <p class="guild-tagline">{{ guild.tagline }}</p>
          </div>
        </div>

        <p class="guild-description">{{ guild.description }}</p>

        <div class="guild-meta">
          <span>👥 {{ guild.member_count }} участников</span>
          <span>🎯 {{ guild.focus }}</span>
        </div>

        <div class="guild-topics">
          <span
            v-for="topic in guild.topics"
            :key="topic"
            class="topic-chip"
          >
            {{ topic }}
          </span>
        </div>

        <div class="card-actions">
          <button
            type="button"
            class="details-btn"
            @click="openGuildPage(guild.slug)"
          >
            Открыть гильдию
          </button>
          <button
            type="button"
            class="join-btn"
            :disabled="joinInProgressId === guild.id || guild.is_joined"
            @click="handleJoinGuild(guild.id)"
          >
            {{ getJoinButtonLabel(guild) }}
          </button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { guildsService, type Guild } from '@/services/guildsService';

const router = useRouter();
const guilds = ref<Guild[]>([]);
const isLoading = ref(true);
const errorMessage = ref('');
const successMessage = ref('');
const joinInProgressId = ref<number | null>(null);

const totalMembers = computed(() =>
  guilds.value.reduce((sum, guild) => sum + guild.member_count, 0),
);

const fetchGuilds = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await guildsService.getGuilds();
    guilds.value = response.guilds;
  } catch (error) {
    console.error('Ошибка загрузки гильдий:', error);
    errorMessage.value = 'Не удалось загрузить гильдии. Попробуй ещё раз.';
  } finally {
    isLoading.value = false;
  }
};

const handleJoinGuild = async (guildId: number) => {
  successMessage.value = '';
  errorMessage.value = '';
  joinInProgressId.value = guildId;

  try {
    const response = await guildsService.joinGuild(guildId);
    await fetchGuilds();
    successMessage.value = response.message;
  } catch (error) {
    console.error('Ошибка вступления в гильдию:', error);
    errorMessage.value = 'Не удалось вступить в гильдию. Попробуй ещё раз.';
  } finally {
    joinInProgressId.value = null;
  }
};

const openGuildPage = (slug: string) => {
  router.push(`/community/guilds/${slug}`);
};

const getJoinButtonLabel = (guild: Guild) => {
  if (joinInProgressId.value === guild.id) {
    return 'Вступаем...';
  }

  if (guild.is_joined) {
    return 'Ты уже в гильдии';
  }

  return 'Вступить в сообщество';
};

onMounted(() => {
  fetchGuilds();
});
</script>

<style scoped>
.guilds-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.guilds-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.8fr);
  gap: 20px;
  padding: 28px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255, 209, 102, 0.24), rgba(255, 107, 107, 0.2));
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);
}

.hero-badge {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: #fff6cf;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 14px;
}

.guilds-hero h2 {
  color: white;
  font-size: 36px;
  margin-bottom: 12px;
}

.hero-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  line-height: 1.6;
  max-width: 720px;
}

.hero-stats {
  display: grid;
  gap: 14px;
}

.hero-stat-card {
  background: rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.hero-stat-number {
  font-size: 34px;
  font-weight: 800;
  color: #ffd166;
}

.hero-stat-label {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 6px;
}

.guilds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.guild-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition:
    transform 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.guild-card.joined {
  background: linear-gradient(135deg, rgba(107, 203, 119, 0.26), rgba(78, 205, 196, 0.2));
  border-color: rgba(107, 203, 119, 0.55);
}

.guild-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.14);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.18);
}

.guild-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.guild-emoji {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 10px 20px rgba(255, 107, 107, 0.22);
}

.guild-card h3 {
  color: white;
  font-size: 22px;
  margin-bottom: 6px;
}

.guild-tagline,
.guild-description,
.guild-meta {
  color: rgba(255, 255, 255, 0.84);
}

.guild-tagline {
  font-size: 14px;
}

.guild-description {
  line-height: 1.55;
}

.guild-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 14px;
}

.guild-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.topic-chip {
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 13px;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.details-btn,
.join-btn {
  flex: 1;
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.details-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.join-btn {
  background: linear-gradient(135deg, #ffd166, #ff6b6b);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.join-btn:disabled {
  opacity: 0.72;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.join-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(255, 107, 107, 0.24);
}

.details-btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.16);
}

.state-card {
  border-radius: 22px;
  padding: 18px 20px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.state-card-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(255, 107, 107, 0.18);
}

.state-card-success {
  background: rgba(107, 203, 119, 0.2);
}

.secondary-btn {
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .guilds-hero {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .guilds-hero h2 {
    font-size: 28px;
  }

  .state-card-error {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
