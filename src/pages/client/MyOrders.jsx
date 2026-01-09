import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, ChevronRight } from 'lucide-react';
import { orderService } from '../../services/orderService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const params = filter !== 'all' ? { status: filter } : {};
                const data = await orderService.getMyOrders(params);
                setOrders(data.orders || []);
                if (data.orders && data.orders.length > 0) {
                    toast.success(`${data.orders.length} commande(s) trouvée(s)`);
                }
            } catch (err) {
                console.error('Error fetching orders');
                toast.error('Erreur lors de la récupération des commandes');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [filter]);

    const statusFilters = [
        { label: 'Toutes', value: 'all' },
        { label: 'En attente', value: 'pending' },
        { label: 'En cours', value: 'active' },
        { label: 'Livrées', value: 'delivered' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mes Commandes</h1>
                    <p className="text-gray-500">Historique complet de vos livraisons</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
                {statusFilters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`
              px-4 py-2 rounded-full text-sm font-semibold transition-all
              ${filter === f.value
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-100'}
            `}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader />
            ) : orders.length === 0 ? (
                <Card className="text-center py-16">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-gray-300" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Aucun résultat</h3>
                    <p className="text-gray-500 mt-1">Nous n'avons trouvé aucune commande correspondant à vos critères.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <Link key={order._id} to={`/client/orders/${order._id}`}>
                            <Card hoverable className="transition-all hover:translate-y-[-4px]">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge status={order.status} />
                                    <span className="text-xs font-mono text-gray-400">#{order._id.substring(0, 8)}</span>
                                </div>
                                <h4 className="font-bold text-gray-900 mb-4 line-clamp-2 h-12">{order.description}</h4>
                                <div className="space-y-3 text-sm border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar size={14} className="text-gray-400" />
                                        <span>{formatDate(order.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">Livreur:</span>
                                        <span className="font-medium text-gray-700">{order.livreur?.fullName || 'En attente'}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                                    Voir les détails
                                    <ChevronRight size={16} />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
