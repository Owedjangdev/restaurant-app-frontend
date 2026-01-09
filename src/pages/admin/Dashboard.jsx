import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingBag,
    Activity,
    Truck,
    CheckCircle,
    TrendingUp,
    Users,
    Eye,
    AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import MapView from '../../components/maps/MapView';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import socket from '../../utils/socket';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsData, ordersData] = await Promise.all([
                    adminService.getDashboardStats(),
                    orderService.getMyOrders()
                ]);

                console.log('📊 Stats:', statsData);
                console.log('📦 Commandes:', ordersData);

                setStats(statsData.stats);
                setRecentOrders((ordersData.orders || []).slice(0, 5));
            } catch (err) {
                console.error('❌ Erreur fetch admin data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    useEffect(() => {
        socket.on('new-order', (data) => {
            console.log('🔔 Dashboard: Nouvelle commande reçue:', data);

            // 1. Mettre à jour les stats
            setStats(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    orders: {
                        ...prev.orders,
                        total: prev.orders.total + 1,
                        pending: (prev.orders.pending || 0) + 1
                    }
                };
            });

            // 2. Mettre à jour les commandes récentes
            const newOrder = {
                _id: data.orderId,
                user: { fullName: data.clientName },
                status: 'PENDING',
                livreur: null,
                createdAt: data.createdAt || new Date().toISOString()
            };

            setRecentOrders(prev => [newOrder, ...prev].slice(0, 5));

            // 3. Notification visuelle
            toast.success(`Nouvelle commande: ${data.orderId.substring(0, 8)}`, {
                icon: '🛒',
                duration: 4000
            });
        });

        return () => {
            socket.off('new-order');
        };
    }, []);

    if (loading) return <Loader fullPage />;

    const kpis = stats ? [
        {
            label: 'Total commandes',
            value: stats.orders.total,
            icon: ShoppingBag,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'En cours',
            value: stats.orders.inDelivery + stats.orders.assigned,
            icon: Activity,
            color: 'text-orange-600',
            bg: 'bg-orange-50'
        },
        {
            label: 'Livreurs vérifiés',
            value: stats.users.verifiedDelivery,
            icon: Truck,
            color: 'text-green-600',
            bg: 'bg-green-50'
        },
        {
            label: 'Livrées',
            value: stats.orders.delivered,
            icon: CheckCircle,
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
    ] : [];

    const mapMarkers = recentOrders
        .filter(o => o.deliveryLocation)
        .map(o => ({
            id: o._id,
            position: [o.deliveryLocation.coordinates[1], o.deliveryLocation.coordinates[0]],
            popup: `CMD-${o._id.substring(0, 8)} - ${o.status}`
        }));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Tableau de Bord</h1>
                <p className="text-gray-500">Vue d'ensemble de l'activité en temps réel</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, idx) => (
                    <Card key={idx} className="border-none shadow-md">
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                                <kpi.icon size={24} />
                            </div>
                            {kpi.trend && (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    {kpi.trend}
                                </span>
                            )}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                            <p className="text-2xl font-black text-gray-900 mt-1">{kpi.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Live Map */}
            {mapMarkers.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-600" />
                            Suivi géographique en direct
                        </h2>
                        <Badge status="IN_DELIVERY">{mapMarkers.length} En mouvement</Badge>
                    </div>
                    <MapView height="450px" markers={mapMarkers} />
                </div>
            )}

            {/* Recent Orders Table */}
            <Card title="Dernières commandes" className="overflow-hidden">
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-y border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">N° Commande</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Livreur</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Heure</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        Aucune commande
                                    </td>
                                </tr>
                            ) : (
                                recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">
                                            #{order._id.substring(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {order.user?.fullName || 'Client Anonyme'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge status={order.status} size="sm" />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.livreur?.fullName || 'En attente'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/admin/orders/${order._id}`}>
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <Eye size={18} />
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
