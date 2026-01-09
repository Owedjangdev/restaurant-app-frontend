import React from 'react';
import { MapPin, Plus, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ClientHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-3xl p-8 mb-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Section */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            Bienvenue, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-blue-100 text-lg">
            Où souhaitez-vous être livré aujourd'hui?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-col justify-between">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
            <p className="text-blue-100 text-sm font-medium">Commandes actives</p>
            <p className="text-3xl font-black">2</p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
            <p className="text-blue-100 text-sm font-medium">Livraison prévue</p>
            <p className="text-blue-100 flex items-center gap-2 font-medium">
              <Clock size={16} /> 30 min
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 flex-wrap">
        <button 
          onClick={() => navigate('/client/new-order')}
          className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus size={20} />
          Nouvelle commande
        </button>
        <button 
          onClick={() => navigate('/client/orders')}
          className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all"
        >
          <MapPin size={20} />
          Historique
        </button>
      </div>
    </div>
  );
};

export default ClientHeader;
