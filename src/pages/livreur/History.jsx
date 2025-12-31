import React, { useState, useEffect } from 'react';
import {
    History as HistoryIcon,
    Search,
    Calendar,
    TrendingUp,
    CheckCircle,
    Clock
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { orderService } from '../../services/orderService';
import { formatDate } from '../../utils/helpers';

const LivreurHistory = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await orderService.getAllOrders({ role: 'livreur', status: 'delivered' });
                setDeliveries(data.orders || []);
            } catch (err) {
                // Fallback demo data
                setDeliveries([
                    { _id: 'h1', status: 'delivered', client: { fullName: 'Saliou Traoré' }, deliveryAddress: 'Cotonou, Fidjrossè', deliveredAt: '2025-01-14T14:30:00Z' },
                    { _id: 'h2', status: 'delivered', client: { fullName: 'Marie Kouassi' }, deliveryAddress: 'Akpakpa, Rue 123', deliveredAt: '2025-01-14T11:15:00Z' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Historique</h1>
                <p className="text-sm text-gray-500">Toutes vos livraisons terminées</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 bg-green-50 border-none">
                    <div className="p-3 bg-white text-green-600 rounded-xl shadow-sm">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-green-700 font-bold uppercase">Total</p>
                        <p className="text-2xl font-black text-green-900">156</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 bg-blue-50 border-none">
                    <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-blue-700 font-bold uppercase">Ce mois</p>
                        <p className="text-2xl font-black text-blue-900">42</p>
                    </div>
                </Card>
            </div>

            <Card title="Livraisons passées" className="p-0 overflow-hidden">
                {loading ? <Loader /> : (
                    <div className="divide-y divide-gray-50">
                        {deliveries.map((d) => (
                            <div key={d._id} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                        <HistoryIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{d.client?.fullName}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{d.deliveryAddress}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">CMD-{d._id.substring(0, 5)}</p>
                                    <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                        <Clock size={10} /> {formatDate(d.deliveredAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LivreurHistory;
