// Mock Order Service for Demo/Development

const DEMO_ORDERS = [];

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockOrderService = {
    // Client
    createOrder: async (orderData) => {
        await delay();

        const newOrder = {
            id: String(DEMO_ORDERS.length + 100), // Start from ID 100 for new orders
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            livreur: null
        };

        DEMO_ORDERS.unshift(newOrder); // Add to beginning of list
        return newOrder;
    },

    getMyOrders: async (filters = {}) => {
        await delay();
        // In a real app we would filter by authenticated user ID
        // For demo, we just return all demo orders for the client
        return DEMO_ORDERS;
    },

    // Admin
    getAllOrders: async (filters = {}) => {
        await delay();
        return DEMO_ORDERS;
    },

    assignOrder: async (orderId, livreurId) => {
        await delay();
        const orderIndex = DEMO_ORDERS.findIndex(o => o.id === orderId);
        if (orderIndex === -1) throw new Error('Commande non trouvée');

        // Mock getting livreur info (in real app backend would handle this)
        const mockLivreur = { id: livreurId, name: 'Livreur Demo', phone: '+229 97 00 00 03' };

        DEMO_ORDERS[orderIndex] = {
            ...DEMO_ORDERS[orderIndex],
            livreur: mockLivreur,
            status: 'accepted'
        };

        return DEMO_ORDERS[orderIndex];
    },

    // Livreur
    updateOrderStatus: async (orderId, status, location = null) => {
        await delay();
        const orderIndex = DEMO_ORDERS.findIndex(o => o.id === orderId);
        if (orderIndex === -1) throw new Error('Commande non trouvée');

        const updates = { status };
        if (location) {
            updates.currentLocation = location;
        }

        DEMO_ORDERS[orderIndex] = {
            ...DEMO_ORDERS[orderIndex],
            ...updates
        };

        return DEMO_ORDERS[orderIndex];
    },

    getOrderById: async (orderId) => {
        await delay();
        const order = DEMO_ORDERS.find(o => o.id === orderId);
        if (!order) throw new Error('Commande non trouvée');
        return order;
    },
};
