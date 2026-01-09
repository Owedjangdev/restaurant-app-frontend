import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Clock, CheckCircle, ChevronRight, MapPin, Truck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import ClientHeader from '../../components/headers/ClientHeader';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ClientDashboard = () => {
    const { user } = useAuth();
    const [activeOrders, setActiveOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const [activeData, allData] = await Promise.all([
                    orderService.getMyOrders({ status: 'active' }),
                    orderService.getMyOrders()
                ]);
                setActiveOrders(activeData.orders || []);
                setAllOrders(allData.orders || []);
                if (activeData.orders && activeData.orders.length > 0) {
                    toast.success(`${activeData.orders.length} commande(s) en cours`);
                }
            } catch (err) {
                console.error('❌ Erreur lors de la récupération des commandes:', err);
                toast.error('Erreur lors de la récupération des commandes');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <Loader fullPage />;

    return (
        <div className="space-y-8">
            {/* Custom Header */}
            <ClientHeader />

            {/* active orders */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Commandes en cours</h2>
                    <Link to="/client/orders" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">
                        Voir tout <ChevronRight size={16} />
                    </Link>
                </div>

                {activeOrders.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 border-dashed border-2">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <Package size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">Aucune commande active</h3>
                        <p className="text-gray-500 max-w-xs mt-1">Vous n'avez pas de commande en cours de livraison pour le moment.</p>
                        <Link to="/client/new-order" className="mt-6">
                            <Button variant="outline" size="sm">Passer une commande</Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeOrders.slice(0, 3).map((order) => (
                            <Link key={order._id} to={`/client/orders/${order._id}`}>
                                <Card hoverable className="h-full flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge status={order.status} />
                                        <span className="text-xs font-mono text-gray-400">#{order._id.substring(0, 8)}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{order.description}</h4>
                                    <div className="mt-auto space-y-2 pt-4 border-t border-gray-50">
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <MapPin size={14} className="text-gray-400" />
                                            <span className="truncate">{order.deliveryAddress}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats/Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total commandes</p>
                        <p className="text-2xl font-bold">{allOrders.length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Livrées</p>
                        <p className="text-2xl font-bold">{allOrders.filter(o => o.status === 'DELIVERED').length}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">En attente</p>
                        <p className="text-2xl font-bold">{activeOrders.length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
