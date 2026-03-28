import axios from 'axios';
import { appConfig } from '@/config/env';
import { getToken } from '@/utils/token';

export const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
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
