import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, CheckCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import useAuthStore from '../../store/authStore';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const newPassword = watch('newPassword');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await authService.changePassword(data.currentPassword, data.newPassword);
            
            if (response.success) {
                setSuccess(true);
                toast.success('Mot de passe changé avec succès !');
                
                setTimeout(() => {
                    if (user?.role === 'admin') {
                        navigate('/admin/dashboard');
                    } else if (user?.role === 'livreur') {
                        navigate('/livreur/dashboard');
                    } else {
                        navigate('/client/dashboard');
                    }
                }, 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
            toast.error(errorMessage);
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mot de passe changé !</h2>
                <p className="text-gray-500">
                    Redirection vers votre tableau de bord...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Changer le mot de passe</h2>
                <p className="text-gray-500 mt-1">Modifiez votre mot de passe actuel</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Mot de passe actuel"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    {...register('currentPassword', { 
                        required: 'Le mot de passe actuel est requis'
                    })}
                    error={errors.currentPassword?.message}
                />

                <Input
                    label="Nouveau mot de passe"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    {...register('newPassword', { 
                        required: 'Le nouveau mot de passe est requis',
                        minLength: {
                            value: 8,
                            message: 'Minimum 8 caractères'
                        }
                    })}
                    error={errors.newPassword?.message}
                />

                <Input
                    label="Confirmer le nouveau mot de passe"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    {...register('confirmPassword', { 
                        required: 'La confirmation est requise',
                        validate: value => value === newPassword || 'Les mots de passe ne correspondent pas'
                    })}
                    error={errors.confirmPassword?.message}
                />

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Changement...' : 'Changer le mot de passe'}
                </Button>
            </form>
        </div>
    );
};

export default ChangePassword;
