import axios from 'axios';
import { storage } from '@/App';

// Create axios instance
export const api = axios.create({
  baseURL: 'http://localhost:8080', // Base URL matching web frontend
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = storage.getString('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const response = await api.post('/auth/refresh-token');
        const { token } = response.data;

        // Save new token
        storage.set('token', token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, logout user
        storage.delete('token');
        // TODO: Navigate to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
