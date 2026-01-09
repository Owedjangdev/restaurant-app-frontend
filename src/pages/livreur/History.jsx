import React, { useState, useEffect } from 'react';
import {
    History as HistoryIcon,
    Search,
    Calendar,
    TrendingUp,
    CheckCircle,
    Clock,
    ChevronRight
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { deliveryService } from '../../services/deliveryService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const LivreurHistory = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await deliveryService.getHistory({ limit: 50 });
                setDeliveries(data.orders || []);
            } catch (err) {
                console.error('Erreur récupération historique:', err);
                toast.error('Erreur lors de la récupération de l\'historique');
                setDeliveries([]);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <Loader fullPage />;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
                <p className="text-sm text-gray-500">Toutes vos livraisons terminées</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 bg-blue-50 border border-blue-200">
                    <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-blue-700 font-bold uppercase">Total</p>
                        <p className="text-2xl font-black text-blue-900">{deliveries.length}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 bg-emerald-50 border border-emerald-200">
                    <div className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-emerald-700 font-bold uppercase">Complétées</p>
                        <p className="text-2xl font-black text-emerald-900">{deliveries.filter(d => d.status === 'DELIVERED').length}</p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 bg-yellow-50 border border-yellow-200">
                    <div className="p-3 bg-white text-yellow-600 rounded-xl shadow-sm">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-yellow-700 font-bold uppercase">Aujourd'hui</p>
                        <p className="text-2xl font-black text-yellow-900">{deliveries.filter(d => new Date(d.deliveredAt).toDateString() === new Date().toDateString()).length}</p>
                    </div>
                </Card>
            </div>

            <Card title="Livraisons passées" className="p-0 overflow-hidden">
                {deliveries.length === 0 ? (
                    <div className="p-8 text-center">
                        <HistoryIcon size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">Aucune livraison terminée</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {deliveries.map((d) => (
                            <div key={d._id} className="p-4 hover:bg-blue-50/30 flex justify-between items-center transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{d.user?.fullName || 'Client'}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[300px]">{d.deliveryAddress}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">CMD-{d._id.substring(0, 5).toUpperCase()}</p>
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
