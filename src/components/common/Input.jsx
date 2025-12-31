import React from 'react';

const Input = React.forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    containerClassName = '',
    required,
    ...props
}, ref) => {
    return (
        <div className={`mb-4 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            block w-full rounded-lg border-gray-300 shadow-sm transition-colors
            focus:border-blue-500 focus:ring-blue-500 sm:text-sm
            ${Icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
