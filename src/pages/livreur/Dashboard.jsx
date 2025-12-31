import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Truck,
    MapPin,
    Phone,
    ChevronRight,
    CheckCircle,
    Navigation,
    Clock,
    AlertCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { orderService } from '../../services/orderService';
import { formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const LivreurDashboard = () => {
    const [isAvailable, setIsAvailable] = useState(true);
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const data = await orderService.getAllOrders({ role: 'livreur', status: 'active' });
                setActiveDeliveries(data.orders || []);
            } catch (err) {
                // Fallback demo data
                setActiveDeliveries([
                    { _id: '1', status: 'in_delivery', client: { fullName: 'Marie Kouassi' }, deliveryAddress: 'Akpakpa, Rue 123', receiverPhone: '+22997000000', description: 'Repas chaud (3 plats)' },
                    { _id: '2', status: 'assigned', client: { fullName: 'Paul Koffi' }, deliveryAddress: 'Abomey-Calavi, Zogbadjè', receiverPhone: '+22996111111', description: 'Documents importants' },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    return (
        <div className="space-y-6 pb-20">
            {/* Header Stat & Toggle */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-gray-900">Ma Session</h1>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                        {isAvailable ? 'En ligne - Prêt à livrer' : 'Hors ligne'}
                    </p>
                </div>
                <button
                    onClick={() => setIsAvailable(!isAvailable)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${isAvailable ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isAvailable ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-blue-600 text-white border-none shadow-blue-100">
                    <p className="text-xs opacity-80 font-bold uppercase">Assignées</p>
                    <p className="text-2xl font-black mt-1">{activeDeliveries.filter(d => d.status === 'assigned').length}</p>
                </Card>
                <Card className="p-4 bg-white border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase">Livrées (Jour)</p>
                    <p className="text-2xl font-black text-gray-900 mt-1">8</p>
                </Card>
            </div>

            {/* Active Deliveries */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                    <Truck size={20} className="text-blue-600" />
                    À livrer
                </h2>

                {loading ? <Loader /> : (
                    <div className="space-y-4">
                        {activeDeliveries.length === 0 ? (
                            <div className="py-12 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <Truck size={48} className="mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500 font-medium">Aucune livraison en attente</p>
                            </div>
                        ) : (
                            activeDeliveries.map((delivery) => (
                                <Link key={delivery._id} to={`/livreur/deliveries/${delivery._id}`}>
                                    <Card hoverable className="p-5 border-none shadow-sm relative overflow-hidden group">
                                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${delivery.status === ORDER_STATUS.IN_DELIVERY ? 'bg-blue-600' : 'bg-orange-400'}`}></div>

                                        <div className="flex justify-between items-start mb-3">
                                            <Badge status={delivery.status} size="sm" />
                                            <span className="text-[10px] font-mono text-gray-400">#{delivery._id.substring(0, 8)}</span>
                                        </div>

                                        <h3 className="font-black text-gray-900 mb-1">{delivery.client?.fullName}</h3>
                                        <p className="text-sm text-gray-600 mb-4 flex items-center gap-1.5">
                                            <MapPin size={14} className="text-gray-400" />
                                            {delivery.deliveryAddress}
                                        </p>

                                        <div className="flex gap-2">
                                            <Button variant="secondary" size="sm" icon={Phone} className="flex-1">Appeler</Button>
                                            <Button size="sm" icon={Navigation} className="flex-1">Démarrer</Button>
                                        </div>
                                    </Card>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Quick History Section */}
            <div className="pt-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4 px-1 flex items-center gap-2">
                    <CheckCircle size={20} className="text-green-600" />
                    Dernières réussites
                </h2>
                <Card className="p-0 overflow-hidden">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">CMD-552{i}AS</p>
                                    <p className="text-xs text-gray-500">Livrée à 14:2{i}</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-gray-300" />
                        </div>
                    ))}
                </Card>
            </div>
        </div>
    );
};

export default LivreurDashboard;
