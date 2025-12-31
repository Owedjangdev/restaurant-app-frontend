import React, { useEffect, useState } from 'react';
import {
    ShoppingBag,
    Activity,
    Truck,
    CheckCircle,
    TrendingUp,
    Users,
    Eye
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import MapView from '../../components/maps/MapView';
import { orderService } from '../../services/orderService';
import { formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        todayOrders: 45,
        activeDeliveries: 18,
        activeLivreurs: 8,
        deliveryRate: 94
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await orderService.getAllOrders({ limit: 5 });
                setRecentOrders(data.orders || []);
                // In a real app, we'd also fetch actual stats from an endpoint
            } catch (err) {
                console.error('Failed to fetch admin data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const kpis = [
        { label: 'Commandes jour', value: stats.todayOrders, trend: '+12%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'En cours', value: stats.activeDeliveries, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Livreurs actifs', value: `${stats.activeLivreurs}/12`, icon: Truck, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Taux de livraison', value: `${stats.deliveryRate}%`, trend: '+2%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

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
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp size={20} className="text-blue-600" />
                        Suivi géographique en direct
                    </h2>
                    <Badge status="in_delivery">18 En mouvement</Badge>
                </div>
                <MapView height="450px" markers={mapMarkers} />
            </div>

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
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-blue-600 font-bold">
                                        #{order._id.substring(0, 8)}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {order.client?.fullName || 'Client Anonyme'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge status={order.status} size="sm" />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {order.livreur?.fullName || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminDashboard;
