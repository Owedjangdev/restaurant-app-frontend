import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone, MessageSquare, AlertTriangle, Trash2 } from 'lucide-react';
import { orderService } from '../../services/orderService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import MapView from '../../components/maps/MapView';
import { formatDate, formatPhoneNumber } from '../../utils/helpers';

const AdminOrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderById(id);
                setOrder(data.order);
            } catch (err) {
                console.error('Order not found');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <Loader fullPage />;
    if (!order) return <div className="p-8 text-center text-gray-500">Commande non trouvée</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">CMD-#{order._id.substring(0, 8)}</h1>
                        <p className="text-sm text-gray-500">Créée le {formatDate(order.createdAt)}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="danger" icon={Trash2}>Annuler</Button>
                    <Button variant="outline">Modifier</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Client">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                    {order.client?.fullName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{order.client?.fullName}</p>
                                    <p className="text-sm text-gray-500">{formatPhoneNumber(order.client?.phone)}</p>
                                </div>
                            </div>
                        </Card>
                        <Card title="Livreur">
                            {order.livreur ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center font-bold">
                                        {order.livreur.fullName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{order.livreur.fullName}</p>
                                        <p className="text-sm text-gray-500">{formatPhoneNumber(order.livreur.phone)}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-2">
                                    <AlertTriangle className="text-yellow-500 mb-2" size={24} />
                                    <p className="text-sm text-gray-500 italic">Aucun livreur assigné</p>
                                    <Button variant="outline" size="sm" className="mt-3">Assigner maintenant</Button>
                                </div>
                            )}
                        </Card>
                    </div>

                    <Card title="Contenu de la commande">
                        <div className="p-4 bg-gray-50 rounded-2xl mb-4">
                            <p className="text-gray-900 font-medium">{order.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Adresse de livraison</p>
                                <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Destinataire</p>
                                <p className="text-sm text-gray-700">{formatPhoneNumber(order.receiverPhone)}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card title="Localisation">
                        <MapView
                            height="250px"
                            center={order.deliveryLocation?.coordinates ? [order.deliveryLocation.coordinates[1], order.deliveryLocation.coordinates[0]] : undefined}
                            markers={order.deliveryLocation ? [{
                                id: 'dest',
                                position: [order.deliveryLocation.coordinates[1], order.deliveryLocation.coordinates[0]],
                                popup: 'Point de livraison'
                            }] : []}
                        />
                    </Card>

                    <Card title="Timeline">
                        <div className="space-y-6 relative pl-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                            <div className="relative">
                                <div className="absolute -left-[24px] w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                                <p className="text-sm font-bold text-gray-900">Création</p>
                                <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                            {order.assignedAt && (
                                <div className="relative">
                                    <div className="absolute -left-[24px] w-4 h-4 bg-blue-600 rounded-full border-4 border-white"></div>
                                    <p className="text-sm font-bold text-gray-900">Assignée</p>
                                    <p className="text-xs text-gray-500">{formatDate(order.assignedAt)}</p>
                                </div>
                            )}
                            <div className="relative">
                                <div className={`absolute -left-[24px] w-4 h-4 ${order.deliveredAt ? 'bg-green-500' : 'bg-gray-200'} rounded-full border-4 border-white`}></div>
                                <p className={`text-sm font-bold ${order.deliveredAt ? 'text-gray-900' : 'text-gray-400'}`}>Livraison effective</p>
                                {order.deliveredAt && <p className="text-xs text-gray-500">{formatDate(order.deliveredAt)}</p>}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetail;
