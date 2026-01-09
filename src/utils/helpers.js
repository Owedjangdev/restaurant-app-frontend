export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatPhoneNumber = (phone) => {
    // +229XXXXXXXX → +229 XX XX XX XX
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})/, '+$1 $2 $3 $4 $5');
};

export const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getStatusColor = (status) => {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        assigned: 'bg-blue-100 text-blue-800',
        in_delivery: 'bg-green-100 text-green-800',
        delivered: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-red-100 text-red-800',
        // Support for uppercase from backend
        PENDING: 'bg-yellow-100 text-yellow-800',
        ASSIGNED: 'bg-blue-100 text-blue-800',
        IN_DELIVERY: 'bg-green-100 text-green-800',
        DELIVERED: 'bg-gray-100 text-gray-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase?.()] || colors[status] || 'bg-gray-100 text-gray-800';
};
