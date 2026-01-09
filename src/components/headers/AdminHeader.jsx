import React from 'react';
import { AlertCircle, TrendingUp, Users, Package, Truck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminHeader = ({ stats = {} }) => {
  const { user } = useAuth();

  const alerts = [];

  return (
    <div className="space-y-6 mb-8">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-3xl p-8 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Welcome */}
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">
              Tableau de bord 📊
            </h1>
            <p className="text-purple-100 text-lg">
              Gestion complète de l'application en temps réel
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 items-end">
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition-all">
              📊 Rapport
            </button>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition-all">
              ⚙️ Paramètres
            </button>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-50 transition-all">
              📱 Support
            </button>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.map((alert) => {
            const AlertIcon = alert.icon;
            return (
              <div
                key={alert.id}
                className={`${alert.bg} border-l-4 rounded-lg p-4 flex items-center gap-3`}
              >
                <AlertIcon size={24} className={alert.color} />
                <div className="flex-1">
                  <p className={`${alert.color} font-semibold text-sm`}>
                    {alert.text}
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Commandes', value: stats.total || 0, color: 'bg-blue-100', textColor: 'text-blue-600' },
          { icon: Truck, label: 'Livreurs', value: stats.verified || 0, color: 'bg-green-100', textColor: 'text-green-600' },
          { icon: TrendingUp, label: 'Taux succès', value: '98%', color: 'bg-purple-100', textColor: 'text-purple-600' },
          { icon: Users, label: 'Utilisateurs', value: stats.users || 0, color: 'bg-orange-100', textColor: 'text-orange-600' },
        ].map((stat, idx) => {
          const StatIcon = stat.icon;
          return (
            <div key={idx} className={`${stat.color} rounded-xl p-4 text-center hover:shadow-lg transition-all`}>
              <StatIcon size={24} className={`${stat.textColor} mx-auto mb-2`} />
              <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminHeader;
