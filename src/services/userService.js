import api from './api';

export const userService = {
  getUsers: async (role = '') => {
    const response = await api.get('/users', { params: role ? { role } : {} });
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);  // ✅ BON
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.patch(`/users/${id}`, userData);  // ✅ BON
    return response.data;
  },

  toggleUserStatus: async (id, active) => {
    const response = await api.patch(`/users/${id}/status`, { active });  // ✅ BON
    return response.data;
  },
};