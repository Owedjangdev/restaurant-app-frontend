import api from './api';
import { mockAuthService } from './mockAuthService';

const USE_MOCK_AUTH = false; 

const realAuthService = {
  register: async (userData) => {
    try {
      console.log('📤 [authService] Envoi des données:', userData);
      console.log('📤 [authService] URL:', api.defaults.baseURL + '/auth/register');
      
      const response = await api.post('/auth/register', userData);
      
      console.log('✅ [authService] Réponse reçue:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ [authService] Erreur complète:', error);
      console.error('❌ [authService] Réponse backend:', error.response?.data);
      console.error('❌ [authService] Status:', error.response?.status);
      throw error; // ✅ Important : relance l'erreur pour que Register.jsx puisse la gérer
    }
  },

  login: async (credentials) => {
    try {
      console.log('📤 [authService] Login:', credentials);
      
      const response = await api.post('/auth/login', credentials);
      
      console.log('✅ [authService] Login réussi:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
      
    } catch (error) {
      console.error('❌ [authService] Erreur login:', error);
      console.error('❌ [authService] Réponse backend:', error.response?.data);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const authService = USE_MOCK_AUTH ? mockAuthService : realAuthService;