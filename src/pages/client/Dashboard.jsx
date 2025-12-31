import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Clock, CheckCircle, ChevronRight, MapPin, Truck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/helpers';

const ClientDashboard = () => {
    const { user } = useAuth();
    const [activeOrders, setActiveOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders({ status: 'active' });
                setActiveOrders(data.orders || []);
            } catch (err) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <Loader fullPage />;

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Bonjour, {user?.fullName || 'Client'} !</h1>
                    <p className="text-blue-100 text-lg mb-8">Où souhaitez-vous être livré aujourd'hui ?</p>
                    <Link to="/client/new-order">
                        <Button
                            size="lg"
                            className=" text-white  border-none font-bold px-8 shadow-lg transform hover:scale-105 transition-all"
                            icon={Plus}
                        >
                            Nouvelle commande
                        </Button>
                    </Link>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-10">
                    <Truck size={240} />
                </div>
            </div>

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
                        <p className="text-2xl font-bold">12</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Livrées</p>
                        <p className="text-2xl font-bold">10</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">En attente</p>
                        <p className="text-2xl font-bold">2</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
