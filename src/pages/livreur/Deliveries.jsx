import React, { useState, useEffect } from 'react';
import { Search, Map as MapIcon, List, Filter, Truck, MapPin, Phone, ChevronRight, Package, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { deliveryService } from '../../services/deliveryService';
import MapView from '../../components/maps/MapView';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Deliveries = () => {
    const [view, setView] = useState('list');
    const [tab, setTab] = useState('active'); // 'active' or 'available'
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState({});

    const fetchData = async () => {
        setLoading(true);
        try {
            const [activeData, availableData] = await Promise.all([
                deliveryService.getMyDeliveries({ status: 'ASSIGNED,IN_DELIVERY' }),
                deliveryService.getAvailableOrders()
            ]);
            setActiveDeliveries(activeData.orders || []);
            setAvailableOrders(availableData.orders || []);
        } catch (err) {
            console.error('Erreur récupération données:', err);
            toast.error('Erreur lors de la récupération des commandes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (orderId) => {
        setAccepting(prev => ({ ...prev, [orderId]: true }));
        try {
            await deliveryService.acceptOrder(orderId);
            toast.success('Commande acceptée !');
            fetchData();
        } catch (err) {
            console.error(err);
            toast.error('Erreur lors de l\'acceptation');
        } finally {
            setAccepting(prev => ({ ...prev, [orderId]: false }));
        }
    };

    const currentDeliveries = tab === 'active' ? activeDeliveries : availableOrders;

    const markers = currentDeliveries.map(d => ({
        id: d._id,
        position: [d.deliveryLocation?.coordinates[1] || 0, d.deliveryLocation?.coordinates[0] || 0],
        popup: `${d.user?.fullName || 'Client'} - ${d.status}`
    })).filter(m => m.position[0] !== 0);

    if (loading && activeDeliveries.length === 0 && availableOrders.length === 0) return <Loader fullPage />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Gestion des Courses</h1>
                    <p className="text-sm text-gray-500">Consultez et acceptez de nouvelles livraisons</p>
                </div>

                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 self-end">
                    <button
                        onClick={() => setView('list')}
                        className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        <List size={20} />
                    </button>
                    <button
                        onClick={() => setView('map')}
                        className={`p-2 rounded-lg transition-all ${view === 'map' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
                    >
                        <MapIcon size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setTab('active')}
                    className={`pb-4 px-2 font-bold transition-all relative ${tab === 'active' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Mes Livraisons ({activeDeliveries.length})
                    {tab === 'active' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setTab('available')}
                    className={`pb-4 px-2 font-bold transition-all relative ${tab === 'available' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Commandes Disponibles ({availableOrders.length})
                    {tab === 'available' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full"></div>}
                </button>
            </div>

            {view === 'map' ? (
                <Card className="p-0 overflow-hidden border-none shadow-xl h-[600px]">
                    <MapView height="100%" markers={markers} />
                </Card>
            ) : (
                <div className="space-y-4">
                    {currentDeliveries.length === 0 ? (
                        <Card className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 border-dashed border-2 border-gray-200">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Package size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Aucune commande {tab === 'active' ? 'en cours' : 'disponible'}</h3>
                            <p className="text-gray-500 max-w-xs mt-2">
                                {tab === 'active'
                                    ? "Vous n'avez pas de livraison active assignée pour le moment."
                                    : "Il n'y a pas de nouvelles commandes à récupérer actuellement. Revenez plus tard !"}
                            </p>
                            {tab === 'active' && availableOrders.length > 0 && (
                                <Button onClick={() => setTab('available')} variant="outline" className="mt-6">
                                    Voir les commandes disponibles
                                </Button>
                            )}
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {currentDeliveries.map((d) => (
                                <Card key={d._id} className="relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4">
                                        <Badge status={d.status} />
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <div className="font-bold text-lg">{d.user?.fullName?.charAt(0) || 'C'}</div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                {d.user?.fullName || 'Client Anonyme'}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-mono">#{d._id.substring(d._id.length - 8)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-start gap-2 text-sm text-gray-600">
                                            <MapPin size={16} className="text-red-500 mt-1 flex-shrink-0" />
                                            <span>{d.deliveryAddress}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock size={16} className="text-blue-500 flex-shrink-0" />
                                            <span>Publié {new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                        {tab === 'active' ? (
                                            <>
                                                <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                    <Phone size={16} className="text-green-600" />
                                                    {d.receiverPhone}
                                                </div>
                                                <Link to={`/livreur/deliveries/${d._id}`}>
                                                    <Button size="sm">Gérer la livraison</Button>
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <div className="text-blue-600 font-bold">Prêt à être collecté</div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAccept(d._id)}
                                                    loading={accepting[d._id]}
                                                >
                                                    Accepter la course
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Deliveries;
