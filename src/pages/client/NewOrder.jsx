import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    ClipboardList,
    MapPin,
    Truck,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Info
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import LocationPicker from '../../components/maps/LocationPicker';
import { orderService } from '../../services/orderService';
import { toast } from 'react-hot-toast';

const orderSchema = z.object({
    description: z.string().min(10, 'La description doit faire au moins 10 caractères'),
    deliveryAddress: z.string().min(5, 'L\'adresse est requise'),
    receiverPhone: z.string().regex(/^\+229\d{8}$/, 'Format requis: +229XXXXXXXX'),
    instructions: z.string().optional(),
});

const NewOrder = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const navigate = useNavigate();

    const [coords, setCoords] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid }
    } = useForm({
        resolver: zodResolver(orderSchema),
        mode: 'onChange'
    });

    const description = watch('description', '');

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const payload = {
                ...data,
                deliveryLocation: coords ? {
                    type: 'Point',
                    coordinates: [coords[1], coords[0]] // [lng, lat] for GeoJSON
                } : null
            };
            const result = await orderService.createOrder(payload);
            setOrderId(result.order._id);
            setStep(4);
            toast.success('Commande créée avec succès !');
        } catch (err) {
            toast.error('Une erreur est survenue lors de la création');
        } finally {
            setLoading(false);
        }
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
            {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className={`
            w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
            ${step === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' :
                            step > s ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}
          `}>
                        {step > s ? <CheckCircle2 size={20} /> : s}
                    </div>
                    {s < 3 && (
                        <div className={`h-1 flex-1 mx-2 rounded ${step > s ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto py-4">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nouvelle livraison</h1>
                <p className="text-gray-500">Suivez les étapes pour enregistrer votre commande</p>
            </div>

            {step < 4 && renderStepIndicator()}

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Description */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <Card title="1. Contenu de la commande">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <ClipboardList size={18} className="text-blue-600" />
                                        Qu'est-ce qu'on transporte ?
                                    </label>
                                    <textarea
                                        className={`block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[150px] p-4 ${errors.description ? 'border-red-500' : 'border-gray-100 bg-gray-50/50'}`}
                                        placeholder="Ex: 2 sacs de riz, une boîte de médicaments, 3 cartons de pizza..."
                                        {...register('description')}
                                    ></textarea>
                                    <div className="flex justify-between mt-2">
                                        <p className="text-xs text-red-500">{errors.description?.message}</p>
                                        <p className={`text-xs font-medium ${description.length < 10 ? 'text-gray-400' : 'text-green-600'}`}>
                                            {description.length} / min 10
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-xl flex gap-3">
                                    <Info className="text-blue-600 shrink-0" size={20} />
                                    <p className="text-sm text-blue-700">Soyez le plus précis possible pour aider le livreur.</p>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end">
                                <Button
                                    onClick={nextStep}
                                    disabled={description.length < 10}
                                    icon={ArrowRight}
                                >
                                    Suivant
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Step 2: Location */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <Card title="2. Où livrer ?">
                            <LocationPicker
                                onLocationSelect={(lat, lng, addr) => {
                                    setCoords([lat, lng]);
                                    if (addr) setValue('deliveryAddress', addr);
                                }}
                            />
                            <div className="mt-6">
                                <Input
                                    label="Adresse textuelle complète"
                                    placeholder="Quartier, Rue, Maison, etc."
                                    error={errors.deliveryAddress?.message}
                                    {...register('deliveryAddress')}
                                />
                            </div>
                            <div className="mt-8 flex justify-between">
                                <Button variant="outline" onClick={prevStep} icon={ArrowLeft}>Retour</Button>
                                <Button onClick={nextStep} disabled={!watch('deliveryAddress')} icon={ArrowRight}>Suivant</Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Step 3: Contact & Confirm */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <Card title="3. Contact et instructions">
                            <div className="space-y-4">
                                <Input
                                    label="Téléphone du destinataire"
                                    placeholder="+229XXXXXXXX"
                                    error={errors.receiverPhone?.message}
                                    {...register('receiverPhone')}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions spéciales (Optionnel)</label>
                                    <textarea
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50"
                                        rows="3"
                                        placeholder="Ex: Porte bleue, appeler à l'arrivée..."
                                        {...register('instructions')}
                                    ></textarea>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Truck size={18} className="text-blue-600" />
                                        Récapitulatif
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Contenu :</span>
                                            <span className="font-medium text-gray-900">{description}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Adresse :</span>
                                            <span className="font-medium text-gray-900">{watch('deliveryAddress')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Destinataire :</span>
                                            <span className="font-medium text-gray-900">{watch('receiverPhone')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <Button variant="outline" onClick={prevStep} icon={ArrowLeft}>Retour</Button>
                                <Button
                                    type="submit"
                                    loading={loading}
                                    icon={CheckCircle2}
                                >
                                    Confirmer la commande
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <div className="animate-in zoom-in duration-500 text-center py-8">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 scale-up">
                            <CheckCircle2 size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Commande envoyée !</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Votre commande <strong>#{orderId?.substring(0, 8)}</strong> a bien été enregistrée. Un livreur sera bientôt affecté.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => navigate(`/client/orders/${orderId}`)}>Suivre ma commande</Button>
                            <Button variant="outline" onClick={() => navigate('/client/dashboard')}>Retour à l'accueil</Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default NewOrder;
