import React from 'react';
import { getStatusColor } from '../../utils/helpers';
import { ORDER_STATUS_LABELS } from '../../utils/constants';

const Badge = ({ status, children, size = 'md', className = '' }) => {
    const colorClass = getStatusColor(status);

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base'
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${colorClass} ${sizes[size]} ${className}`}>
            {children || ORDER_STATUS_LABELS[status] || status}
        </span>
    );
};

export default Badge;
