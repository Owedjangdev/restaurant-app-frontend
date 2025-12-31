import { create } from 'zustand';

const useOrderStore = create((set) => ({
    orders: [],
    selectedOrder: null,
    filters: {
        status: 'all',
        dateRange: 'today',
        livreurId: null,
    },

    setOrders: (orders) => set({ orders }),
    setSelectedOrder: (order) => set({ selectedOrder: order }),
    updateFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),

    addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
    })),

    updateOrder: (orderId, updates) => set((state) => ({
        orders: state.orders.map(order =>
            order._id === orderId ? { ...order, ...updates } : order
        )
    })),
}));

export default useOrderStore;
