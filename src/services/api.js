import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_BASE_URL = 'http://localhost:3000/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 [api.js] Requête:', config.method?.toUpperCase(), config.url); // ✅ Debug
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for 401 errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ [api.js] Réponse OK:', response.status, response.config.url); // ✅ Debug
    return response;
  },
  (error) => {
    console.error('❌ [api.js] Erreur:', error.response?.status, error.config?.url); // ✅ Debug
    
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

