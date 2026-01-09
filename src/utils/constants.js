export const ORDER_STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    IN_DELIVERY: 'in_delivery',
    DELIVERED: 'delivered',
    RECEIVED: 'received',
    CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
    pending: 'En attente',
    assigned: 'Assignée',
    in_delivery: 'En cours de livraison',
    delivered: 'Livrée (à confirmer)',
    received: 'Terminée',
    cancelled: 'Annulée',
    // Support for uppercase from backend
    PENDING: 'En attente',
    ASSIGNED: 'Assignée',
    IN_DELIVERY: 'En cours de livraison',
    DELIVERED: 'Livrée (à confirmer)',
    RECEIVED: 'Terminée',
    CANCELLED: 'Annulée',
};

export const USER_ROLES = {
    ADMIN: 'admin',
    CLIENT: 'client',
    LIVREUR: 'livreur',
};

export const COTONOU_CENTER = [6.3703, 2.3912]; // [latitude, longitude]

export const MAP_DEFAULTS = {
    ZOOM: 13,
    MAX_ZOOM: 18,
    MIN_ZOOM: 10,
};
