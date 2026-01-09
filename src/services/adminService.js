import api from './api';

export const adminService = {
  // Users
  getAllUsers: async (filters = {}) => {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  },

  deactivateUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/deactivate`);
    return response.data;
  },

  // Delivery Applications
  getDeliveryApplications: async () => {
    const response = await api.get('/admin/deliveries/applications');
    return response.data;
  },

  verifyDelivery: async (userId) => {
    const response = await api.put(`/admin/deliveries/${userId}/verify`);
    return response.data;
  },

  rejectDelivery: async (userId, reason = '') => {
    const response = await api.delete(`/admin/deliveries/${userId}/reject`, {
      data: { reason }
    });
    return response.data;
  },

  createDelivery: async (deliveryData) => {
    const response = await api.post('/admin/deliveries/create', deliveryData);
    return response.data;
  },

  // Orders
  getAllOrders: async (filters = {}) => {
    const response = await api.get('/admin/orders', { params: filters });
    return response.data;
  },

  assignOrderToDelivery: async (orderId, livreurId) => {
    const response = await api.post(`/admin/orders/${orderId}/assign`, { livreurId });
    return response.data;
  },

  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};
