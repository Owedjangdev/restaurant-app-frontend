import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ fullPage = false, size = 'md' }) => {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    if (fullPage) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[999] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className={`${sizes[size]} text-blue-600 animate-spin`} />
                    <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className={`${sizes[size]} text-blue-600 animate-spin`} />
        </div>
    );
};

export default Loader;
