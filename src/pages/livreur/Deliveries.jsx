import React, { useState, useEffect } from 'react';
import { Search, Map as MapIcon, List, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { orderService } from '../../services/orderService';
import MapView from '../../components/maps/MapView';
import { Link } from 'react-router-dom';

const Deliveries = () => {
    const [view, setView] = useState('list');
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const data = await orderService.getAllOrders({ role: 'livreur', status: 'active' });
                setDeliveries(data.orders || []);
            } catch (err) {
                setDeliveries([
                    { _id: '1', status: 'in_delivery', client: { fullName: 'Marie Kouassi' }, deliveryAddress: 'Akpakpa, Rue 123', deliveryLocation: { coordinates: [2.44, 6.36] } },
                    { _id: '2', status: 'assigned', client: { fullName: 'Paul Koffi' }, deliveryAddress: 'Abomey-Calavi, Zogbadjè', deliveryLocation: { coordinates: [2.35, 6.42] } },
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    const markers = deliveries.map(d => ({
        id: d._id,
        position: [d.deliveryLocation.coordinates[1], d.deliveryLocation.coordinates[0]],
        popup: `${d.client.fullName} - ${d.status}`
    }));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mes Livraisons</h1>
                    <p className="text-sm text-gray-500">Gérez vos courses en cours</p>
                </div>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
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

            {loading ? <Loader /> : (
                <>
                    {view === 'map' ? (
                        <Card className="p-0 overflow-hidden border-none shadow-xl h-[600px]">
                            <MapView height="100%" markers={markers} />
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {deliveries.map((d) => (
                                <Link key={d._id} to={`/livreur/deliveries/${d._id}`}>
                                    <Card hoverable className="p-5 border-none shadow-sm group">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge status={d.status} />
                                            <span className="text-xs font-mono text-gray-400">#{d._id.substring(0, 8)}</span>
                                        </div>
                                        <h3 className="font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{d.client.fullName}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{d.deliveryAddress}</p>
                                        <div className="mt-6 flex justify-end">
                                            <Button size="sm" variant="outline">Action rapide</Button>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Deliveries;
