import React from 'react';

const Card = ({ title, children, className = '', hoverable = false, footer }) => {
    return (
        <div className={`
      bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden
      ${hoverable ? 'hover:shadow-md transition-shadow' : ''}
      ${className}
    `}>
            {title && (
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
            {footer && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
