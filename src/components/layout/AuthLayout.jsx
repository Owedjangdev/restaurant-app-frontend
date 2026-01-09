import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const AuthLayout = () => {
    const { isAuthenticated, user } = useAuthStore();

    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated && user) {
        const roleRoutes = {
            admin: '/admin/dashboard',
            client: '/client/dashboard',
            livreur: '/livreur/dashboard',
        };
        return <Navigate to={roleRoutes[user.role]} replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-auth-pattern">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center transform -rotate-6">
                            <span className="text-white text-2xl font-black">D</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                            DELIVERY<span className="text-blue-600">PRO</span>
                        </h1>
                    </div>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
                    <Outlet />
                </div>

                <p className="mt-8 text-center text-sm text-gray-500">
                    © 2025 Delivery Pro. Tous droits réservés.
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .bg-auth-pattern {
          background-image: radial-gradient(#3b82f6 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          background-color: #f9fafb;
          animation: bg-move 60s linear infinite;
        }
        @keyframes bg-move {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }
      `}} />
        </div>
    );
};

export default AuthLayout;
