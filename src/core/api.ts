import axios from 'axios';
import { getToken } from '@/utils/token';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (req) => {
    const token = getToken();
    if (!token) return req;

    req.headers.Authorization = `Bearer ${token}`;
    return req;
  },
  (err) => Promise.reject(err),
);
