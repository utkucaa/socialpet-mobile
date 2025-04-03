import axios from 'axios';
import { storage } from '@/App';
import { Platform } from 'react-native';
import { navigate } from '../navigation/NavigationRef';

// Constants for logging - can be disabled in production
const ENABLE_REQUEST_LOGS = __DEV__;
const ENABLE_RESPONSE_LOGS = __DEV__;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log the request (only in development)
    if (ENABLE_REQUEST_LOGS) {
      // eslint-disable-next-line no-console
      console.log(
        `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
        config.params || {},
        config.data || {}
      );
    }
    
    // Add auth token if available
    const token = storage.getString('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    if (ENABLE_REQUEST_LOGS) {
      // eslint-disable-next-line no-console
      console.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log the response (only in development)
    if (ENABLE_RESPONSE_LOGS) {
      // eslint-disable-next-line no-console
      console.log(
        `API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
        response.data
      );
    }
    
    return response;
  },
  (error) => {
    // Log the error (only in development)
    if (ENABLE_RESPONSE_LOGS) {
      // eslint-disable-next-line no-console
      console.error('API Response Error:', error.response || error);
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      if (ENABLE_RESPONSE_LOGS) {
        // eslint-disable-next-line no-console
        console.log('Authentication error, redirecting to login');
      }
      
      // Remove token and user from storage
      storage.delete('token');
      storage.delete('user');
      
      // Navigate to Auth navigator which contains the Login screen
      navigate('Auth');
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      if (ENABLE_RESPONSE_LOGS) {
        // eslint-disable-next-line no-console
        console.error('Server error:', error.response);
      }
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      if (ENABLE_RESPONSE_LOGS) {
        // eslint-disable-next-line no-console
        console.error('Network error:', error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
