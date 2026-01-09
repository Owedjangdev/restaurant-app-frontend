import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation, Truck, Clock, CheckCircle, ChevronRight, MapPin, Activity, Phone, Package, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { deliveryService } from '../../services/deliveryService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const LivreurDashboard = () => {
    const { user } = useAuth();
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [allDeliveries, setAllDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activeData, allData, availableData] = await Promise.all([
                    deliveryService.getMyDeliveries({ status: 'ASSIGNED,IN_DELIVERY' }),
                    deliveryService.getMyDeliveries(),
                    deliveryService.getAvailableOrders()
                ]);

                setActiveDeliveries(activeData.orders || []);
                setAllDeliveries(allData.orders || []);
                setAvailableOrders(availableData.orders || []);
            } catch (err) {
                console.error('❌ Erreur lors de la récupération des données:', err);
                toast.error('Erreur lors de la récupération des données');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Loader fullPage />;

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Truck size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Livraisons</p>
                            <p className="text-2xl font-black text-gray-900">{allDeliveries.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Complétées</p>
                            <p className="text-2xl font-black text-gray-900">{allDeliveries.filter(d => d.status === 'DELIVERED').length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Actives</p>
                            <p className="text-2xl font-black text-gray-900">{activeDeliveries.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Disponibles</p>
                            <p className="text-2xl font-black text-gray-900">{availableOrders.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Deliveries List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Livraisons en cours</h2>
                        <Link to="/livreur/deliveries" className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-sm">
                            Gérer tout <ChevronRight size={16} />
                        </Link>
                    </div>

                    {activeDeliveries.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center py-16 text-center bg-blue-50/30 border-dashed border-2 border-blue-100">
                            <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                <Truck size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Aucune livraison active</h3>
                            <p className="text-gray-500 max-w-sm mt-2">Vous n'avez pas de livraison en cours. Consultez les commandes disponibles pour commencer à gagner de l'argent !</p>
                            <Link to="/livreur/deliveries" className="mt-8">
                                <Button className="px-8 shadow-lg shadow-blue-200">Voir les disponibles</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {activeDeliveries.map((delivery) => (
                                <Link key={delivery._id} to={`/livreur/deliveries/${delivery._id}`}>
                                    <div className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col sm:flex-row sm:items-center gap-6">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors capitalize font-black text-2xl">
                                            {delivery.user?.fullName?.charAt(0) || 'C'}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-lg text-gray-900">{delivery.user?.fullName || 'Client'}</h4>
                                                <Badge status={delivery.status} />
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                                <MapPin size={14} className="text-red-500" />
                                                <span className="truncate">{delivery.deliveryAddress}</span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                                <Phone size={14} className="text-green-500" />
                                                <span>{delivery.receiverPhone}</span>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-50 pt-4 sm:pt-0 sm:pl-6">
                                            <span className="text-xs font-mono text-gray-400">#{delivery._id.substring(delivery._id.length - 6)}</span>
                                            <ChevronRight className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Alerts / Recent */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Annonces</h3>
                    <Card className="bg-gradient-to-br from-indigo-500 to-blue-700 border-none text-white overflow-hidden relative group">
                        <div className="relative z-10">
                            <Bell className="mb-4 text-white/80" size={32} />
                            <h4 className="text-lg font-bold mb-2">Bonne nouvelle !</h4>
                            <p className="text-sm text-white/80 leading-relaxed mb-6">
                                {availableOrders.length > 0
                                    ? `Il y a actuellement ${availableOrders.length} nouvelles commandes en attente dans votre secteur.`
                                    : "Restez en ligne pour recevoir les prochaines commandes dès qu'elles sont publiées."}
                            </p>
                            {availableOrders.length > 0 && (
                                <Link to="/livreur/deliveries">
                                    <button className="bg-white text-blue-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-black/20">
                                        Voir les commandes
                                    </button>
                                </Link>
                            )}
                        </div>
                        <Activity size={120} className="absolute -bottom-10 -right-10 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                    </Card>

                    <Card className="border-none shadow-sm bg-gray-50">
                        <h4 className="font-bold text-gray-900 mb-4">Conseil Pro</h4>
                        <p className="text-sm text-gray-600 italic">"Mettez à jour votre position régulièrement pour que les clients puissent vous suivre en temps réel et vous donner de meilleures notes."</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LivreurDashboard;
