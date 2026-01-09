import React from 'react';
import { Outlet } from 'react-router-dom';
import LivreurHeader from '../headers/LivreurHeader';

const LivreurLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-gray-50 to-gray-100 flex flex-col">
      {/* Header with Navigation */}
      <LivreurHeader />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 font-medium">
              © 2025 Plateforme Livreur PRO. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Version 1.0</span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LivreurLayout;
