import React from 'react';
import { MapPin, Truck, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DeliveryHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-3xl p-8 mb-8 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Welcome Section */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-black mb-2 tracking-tight">
            Prêt à livrer, {user?.fullName?.split(' ')[0]}? 🚚
          </h1>
          <p className="text-green-100 text-lg">
            {user?.isVerified ? '✅ Vous êtes vérifiés' : '⏳ En attente de vérification par un administrateur'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="space-y-3">
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
            <p className="text-green-100 text-sm font-medium">Évaluation</p>
            <p className="text-2xl font-black flex items-center gap-2">
              <Star size={20} className="fill-yellow-300 text-yellow-300" />
              {user?.rating || 5}.0
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
            <p className="text-green-100 text-sm font-medium">Véhicule</p>
            <p className="text-green-100 capitalize font-medium">
              {user?.vehicleType || 'Non défini'}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {user?.isVerified && (
        <div className="mt-8 flex gap-4 flex-wrap">
          <button className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg">
            <MapPin size={20} />
            Commandes disponibles
          </button>
          <button className="bg-green-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-600 transition-all">
            <Truck size={20} />
            Mes livraisons
          </button>
        </div>
      )}

      {!user?.isVerified && (
        <div className="mt-6 p-4 bg-white/20 backdrop-blur rounded-xl border border-white/30">
          <p className="text-green-100 font-medium">
            ⏳ Votre inscription est en cours de vérification. Un administrateur vous contactera bientôt!
          </p>
        </div>
      )}
    </div>
  );
};

export default DeliveryHeader;
