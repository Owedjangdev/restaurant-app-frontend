import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Phone,
    MessageSquare,
    Clock,
    User,
    HelpCircle,
    Truck,
    Lock
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import MapView from '../../components/maps/MapView';
import { formatDate, formatPhoneNumber } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrderById(id);
                setOrder(data.order);
                toast.success('Commande chargée');
            } catch (err) {
                console.error('Order not found');
                toast.error('Commande non trouvée');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handleConfirmReceipt = async () => {
        // Obsolete with OTP verification
    };

    if (loading) return <Loader fullPage />;
    if (!order) return <div className="p-8 text-center">Commande non trouvée</div>;

    const steps = [
        { status: ORDER_STATUS.PENDING, label: 'Commande reçue', time: order.createdAt },
        { status: ORDER_STATUS.ASSIGNED, label: 'Livreur assigné', time: order.assignedAt },
        { status: ORDER_STATUS.IN_DELIVERY, label: 'En cours de livraison', time: order.pickedUpAt },
        { status: ORDER_STATUS.DELIVERED, label: 'Livrée par le livreur', time: order.deliveredAt },
        { status: ORDER_STATUS.RECEIVED, label: 'Terminée (Confirmée par vous)', time: order.status === 'RECEIVED' ? order.updatedAt : null },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Commande #{order._id.substring(0, 8)}</h1>
                    <p className="text-sm text-gray-500">Passée le {formatDate(order.createdAt)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Statut de la livraison</h2>
                            <Badge status={order.status} size="lg" />
                        </div>

                        {(order.status === 'IN_DELIVERY' || order.status === 'DELIVERED') && (
                            <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center text-center gap-4">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                    <Lock size={32} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Code de Livraison</h3>
                                    <p className="text-gray-600">Donnez ce code au livreur pour finaliser la réception.</p>
                                </div>
                                <div className="text-4xl font-black tracking-[0.5em] text-blue-600 bg-white px-8 py-4 rounded-xl shadow-sm border border-blue-100">
                                    {order.deliveryCode}
                                </div>
                            </div>
                        )}

                        {/* Timeline */}
                        <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                            {steps.map((step, index) => {
                                const isPast = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.status} className="relative">
                                        <div className={`
                      absolute -left-[30px] w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center
                      ${isPast ? (step.status === ORDER_STATUS.DELIVERED ? 'bg-green-500' : 'bg-blue-600') : 'bg-gray-200'}
                      ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                    `}>
                                            {isPast && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                        </div>
                                        <div>
                                            <p className={`font-bold ${isPast ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                            {step.time && <p className="text-xs text-gray-500">{formatDate(step.time)}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <Card title="Détails de la commande">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 uppercase tracking-wider font-bold text-[10px] mb-1">Description</p>
                                <p className="text-gray-800 font-medium">{order.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold text-[10px] mb-1">Adresse de livraison</p>
                                    <p className="text-gray-800 font-medium flex items-center gap-2">
                                        <MapPin size={14} className="text-blue-500" />
                                        {order.deliveryAddress}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-bold text-[10px] mb-1">Téléphone destinataire</p>
                                    <p className="text-gray-800 font-medium flex items-center gap-2">
                                        <Phone size={14} className="text-blue-500" />
                                        {formatPhoneNumber(order.receiverPhone)}
                                    </p>
                                </div>
                            </div>
                            {order.instructions && (
                                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                    <p className="text-sm text-yellow-800 font-semibold mb-1 flex items-center gap-2">
                                        <MessageSquare size={14} />
                                        Instructions spéciales
                                    </p>
                                    <p className="text-sm text-yellow-700">{order.instructions}</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card title="Localisation">
                        <MapView
                            height="240px"
                            center={order.deliveryLocation?.coordinates ? [order.deliveryLocation.coordinates[1], order.deliveryLocation.coordinates[0]] : undefined}
                            markers={order.deliveryLocation ? [{
                                id: 'delivery',
                                position: [order.deliveryLocation.coordinates[1], order.deliveryLocation.coordinates[0]],
                                popup: 'Destination'
                            }] : []}
                        />
                    </Card>

                    {(order.livreur || order.status === ORDER_STATUS.IN_DELIVERY) && (
                        <Card title="Votre livreur">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                    {order.livreur?.avatar ? (
                                        <img src={order.livreur.avatar} className="w-full h-full rounded-2xl object-cover" />
                                    ) : <User size={32} />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">{order.livreur?.fullName || 'Livreur en approche'}</p>
                                    <p className="text-sm text-gray-500">⭐ {order.livreur?.rating || 5}.0 (Vérifié)</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" icon={Phone} fullWidth size="sm">Appeler</Button>
                                <Button variant="outline" icon={MessageSquare} fullWidth size="sm">Chat</Button>
                            </div>
                        </Card>
                    )}

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-4 group cursor-pointer hover:border-blue-200 transition-colors">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                            <HelpCircle size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Besoin d'aide ?</p>
                            <p className="text-sm text-gray-500">Contacter le support</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
