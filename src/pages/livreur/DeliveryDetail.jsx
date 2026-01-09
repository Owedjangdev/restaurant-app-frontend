import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    MapPin,
    Phone,
    Navigation,
    CheckCircle,
    MessageSquare,
    AlertCircle,
    Info
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import RouteMap from '../../components/maps/RouteMap';
import { orderService } from '../../services/orderService';
import { formatDate, formatPhoneNumber } from '../../utils/helpers';
import { ORDER_STATUS, COTONOU_CENTER } from '../../utils/constants';
import { toast } from 'react-hot-toast';

const DeliveryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [otpCode, setOtpCode] = useState('');

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const data = await orderService.getOrderById(id);
                setDelivery(data.order);
            } catch (err) {
                toast.error('Livraison introuvable');
            } finally {
                setLoading(false);
            }
        };
        fetchDelivery();
    }, [id]);

    const handleUpdateStatus = async (newStatus) => {
        setUpdateLoading(true);
        try {
            // Get current location if confirming delivery
            let location = null;
            if (newStatus === ORDER_STATUS.DELIVERED) {
                // Mock geolocation for confirmation
                location = {
                    type: 'Point',
                    coordinates: [2.3912, 6.3703]
                };
            }

            await orderService.updateOrderStatus(id, newStatus, location, otpCode);
            toast.success(newStatus === ORDER_STATUS.IN_DELIVERY ? 'Livraison démarrée !' : 'Livraison terminée !');

            if (newStatus === ORDER_STATUS.DELIVERED) {
                setIsConfirmModalOpen(false);
                navigate('/livreur/dashboard');
            } else {
                // Refresh local state
                const data = await orderService.getOrderById(id);
                setDelivery(data.order);
            }
        } catch (err) {
            toast.error('Erreur lors de la mise à jour');
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) return <Loader fullPage />;
    if (!delivery) return <div className="p-8 text-center">Livraison non trouvée</div>;

    return (
        <div className="space-y-6 pb-24">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-gray-900">Destination</h1>
                    <Badge status={delivery.status} />
                </div>
            </div>

            {/* Map Section */}
            <Card className="p-0 overflow-hidden border-none shadow-lg">
                <div className="h-80 w-full relative">
                    <RouteMap
                        start={COTONOU_CENTER}
                        end={delivery.deliveryLocation?.coordinates ? [delivery.deliveryLocation.coordinates[1], delivery.deliveryLocation.coordinates[0]] : undefined}
                        height="100%"
                    />
                </div>
            </Card>

            {/* Client Info */}
            <Card className="border-none shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <span className="font-black text-lg">{delivery.user?.fullName?.charAt(0) || 'C'}</span>
                        </div>
                        <div>
                            <h2 className="font-black text-gray-900">{delivery.user?.fullName || 'Client Anonyme'}</h2>
                            <p className="text-sm text-gray-500">{formatPhoneNumber(delivery.receiverPhone)}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href={`tel:${delivery.receiverPhone}`} className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-all">
                            <Phone size={20} />
                        </a>
                        <a href={`https://wa.me/${delivery.receiverPhone.replace('+', '')}`} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all">
                            <MessageSquare size={20} />
                        </a>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50 space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Adresse</p>
                        <p className="text-gray-800 font-medium flex items-start gap-2">
                            <MapPin size={16} className="text-blue-500 mt-1 shrink-0" />
                            {delivery.deliveryAddress}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contenu</p>
                        <p className="text-gray-800 font-medium">{delivery.description}</p>
                    </div>
                    {delivery.instructions && (
                        <div className="bg-orange-50 p-3 rounded-xl flex gap-3 border border-orange-100">
                            <Info className="text-orange-500 shrink-0" size={18} />
                            <p className="text-sm text-orange-700 font-medium">{delivery.instructions}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Floating Action Button at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 lg:left-64 z-40">
                <div className="max-w-7xl mx-auto">
                    {delivery.status === ORDER_STATUS.ASSIGNED && (
                        <Button
                            fullWidth
                            size="lg"
                            icon={Navigation}
                            className="py-4 shadow-xl shadow-blue-200"
                            loading={updateLoading}
                            onClick={() => handleUpdateStatus(ORDER_STATUS.IN_DELIVERY)}
                        >
                            Démarrer la livraison
                        </Button>
                    )}

                    {delivery.status === ORDER_STATUS.IN_DELIVERY && (
                        <Button
                            fullWidth
                            size="lg"
                            variant="success"
                            icon={CheckCircle}
                            className="py-4 shadow-xl shadow-green-200"
                            onClick={() => setIsConfirmModalOpen(true)}
                        >
                            Confirmer la livraison
                        </Button>
                    )}

                    {delivery.status === ORDER_STATUS.DELIVERED && (
                        <div className="bg-blue-100 text-blue-700 py-4 rounded-xl flex flex-col items-center justify-center gap-1 font-bold text-center">
                            <div className="flex items-center gap-2">
                                <CheckCircle size={20} />
                                <span>Colis remis au client</span>
                            </div>
                            <p className="text-xs font-medium opacity-80 italic">En attente de confirmation par le client</p>
                        </div>
                    )}

                    {delivery.status === ORDER_STATUS.RECEIVED && (
                        <div className="bg-green-100 text-green-700 py-3 rounded-xl flex items-center justify-center gap-2 font-bold">
                            <CheckCircle size={20} />
                            Livraison terminée (Confirmée)
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Clôturer la livraison"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle size={32} />
                    </div>
                    <p className="text-gray-600 font-medium">Demandez le code à 6 chiffres au client pour finaliser la livraison :</p>

                    <div className="py-2">
                        <input
                            type="text"
                            maxLength="6"
                            placeholder="Ex: 123456"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center text-3xl font-black tracking-[0.3em] py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-0 transition-all placeholder:text-gray-200"
                        />
                    </div>

                    <div className="pt-4 space-y-2">
                        <Button
                            fullWidth
                            variant="success"
                            loading={updateLoading}
                            disabled={otpCode.length !== 6}
                            onClick={() => handleUpdateStatus(ORDER_STATUS.DELIVERED)}
                        >
                            Valider la livraison
                        </Button>
                        <Button variant="ghost" fullWidth onClick={() => {
                            setIsConfirmModalOpen(false);
                            setOtpCode('');
                        }}>Annuler</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default DeliveryDetail;
