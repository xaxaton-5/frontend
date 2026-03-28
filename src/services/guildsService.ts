import axiosInstance from '@/api/axiosInstance';

export interface Guild {
  id: number;
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
  description: string;
  focus: string;
  topics: string[];
  member_count: number;
  is_joined: boolean;
}

export interface GuildsResponse {
  guilds: Guild[];
  current_guild_id: number | null;
}

export interface JoinGuildResponse {
  status: string;
  message: string;
  membership: {
    guild_id: number;
    guild_name: string;
    joined_at: string;
  };
}

export const guildsService = {
  getGuilds: async (): Promise<GuildsResponse> => {
    const response = await axiosInstance.get('/guilds/list/');
    return response.data;
  },

  joinGuild: async (guildId: number): Promise<JoinGuildResponse> => {
    const response = await axiosInstance.post('/guilds/join/', { guild_id: guildId });
    return response.data;
  },
};
