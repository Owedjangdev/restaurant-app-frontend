import api from './api';

export const deliveryService = {
  // Récupérer le profil du livreur
  getProfile: async () => {
    const response = await api.get('/delivery/profile');
    return response.data;
  },

  // Mettre à jour le profil du livreur
  updateProfile: async (profileData) => {
    const response = await api.put('/delivery/profile', profileData);
    return response.data;
  },

  // Récupérer les commandes disponibles
  getAvailableOrders: async (filters = {}) => {
    const response = await api.get('/delivery/available-orders', { params: filters });
    return response.data;
  },

  // Accepter une commande
  acceptOrder: async (orderId) => {
    const response = await api.post(`/delivery/accept-order/${orderId}`);
    return response.data;
  },

  // Récupérer mes livraisons (actives)
  getMyDeliveries: async (filters = {}) => {
    const response = await api.get('/delivery/my-deliveries', { params: filters });
    return response.data;
  },

  // Mettre à jour la localisation GPS
  updateLocation: async (orderId, latitude, longitude, status = null) => {
    const data = {
      latitude,
      longitude,
    };
    if (status) {
      data.status = status;
    }
    const response = await api.put(`/delivery/update-location/${orderId}`, data);
    return response.data;
  },

  // Récupérer l'historique des livraisons
  getHistory: async (filters = {}) => {
    const response = await api.get('/delivery/history', { params: filters });
    return response.data;
  },

  // Récupérer les statistiques des livraisons
  getStatistics: async () => {
    const response = await api.get('/delivery/stats');
    return response.data;
  },

  // Marquer une livraison comme complétée
  completeDelivery: async (orderId, proof = null) => {
    const data = {};
    if (proof) {
      data.proof = proof;
    }
    const response = await api.put(`/delivery/complete/${orderId}`, data);
    return response.data;
  },
};
