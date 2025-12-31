import api from './api';

export const orderService = {
    // Client
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    getMyOrders: async (filters = {}) => {
        const response = await api.get('/orders', { params: filters });
        return response.data;
    },

    // Admin
    getAllOrders: async (filters = {}) => {
        const response = await api.get('/orders', { params: filters });
        return response.data;
    },

    assignOrder: async (orderId, livreurId) => {
        const response = await api.patch(`/orders/${orderId}/assign`, { livreurId });
        return response.data;
    },

    // Livreur
    updateOrderStatus: async (orderId, status, location = null) => {
        const response = await api.patch(`/orders/${orderId}/status`, {
            status,
            deliveryLocation: location
        });
        return response.data;
    },

    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },
};
