// services/resultsService.ts
import axiosInstance from '@/api/axiosInstance';

export interface ResultData {
  key: string;
  result_type: 'theory' | 'test' | 'practice' | 'game';
  exp_earned: number;
}

export interface UserResult {
  id: number;
  user_id: number;
  username: string;
  result_type: string;
  key: string;
  exp_earned: number;
  created_at: string;
}

export interface ResultsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserResult[];
}

export const resultsService = {
  // Сохранение результата
  saveResult: async (data: ResultData): Promise<UserResult> => {
    const response = await axiosInstance.post('/user/result/', data);
    return response.data;
  },

  // Получение всех результатов пользователя
  getUserResults: async (): Promise<UserResult[]> => {
    const response = await axiosInstance.get<ResultsResponse>('/user/results/', {
      params: { limit: 10000 },
    });
    return response.data.results;
  },
};
