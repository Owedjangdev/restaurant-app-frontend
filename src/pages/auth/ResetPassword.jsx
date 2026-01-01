import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const resetToken = location.state?.resetToken;
    const email = location.state?.email;

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const newPassword = watch('newPassword');

    const onSubmit = async (data) => {
        if (!resetToken) {
            toast.error('Token de réinitialisation manquant');
            navigate('/forgot-password');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.resetPassword(resetToken, data.newPassword);
            
            if (response.success) {
                setSuccess(true);
                toast.success('Mot de passe réinitialisé avec succès !');
                
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de la réinitialisation';
            toast.error(errorMessage);
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!resetToken) {
        return (
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-4">
                    <Lock size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Accès invalide</h2>
                <p className="text-gray-500">
                    Veuillez passer par la page "Mot de passe oublié" pour réinitialiser votre mot de passe.
                </p>
                <div className="pt-4">
                    <Link to="/forgot-password">
                        <Button variant="primary" fullWidth>
                            Mot de passe oublié
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Mot de passe réinitialisé !</h2>
                <p className="text-gray-500">
                    Votre mot de passe a été changé avec succès. Redirection vers la connexion...
                </p>
                <div className="pt-4">
                    <Link to="/login">
                        <Button variant="outline" icon={ArrowLeft} fullWidth>
                            Aller à la connexion
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Nouveau mot de passe</h2>
                <p className="text-gray-500 mt-1">
                    Créez un nouveau mot de passe pour {email || 'votre compte'}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Nouveau mot de passe"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    {...register('newPassword', { 
                        required: 'Le mot de passe est requis',
                        minLength: {
                            value: 8,
                            message: 'Minimum 8 caractères'
                        }
                    })}
                    error={errors.newPassword?.message}
                />

                <Input
                    label="Confirmer le mot de passe"
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
                    {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </Button>
            </form>

            <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                    <ArrowLeft size={16} className="mr-2" />
                    Retour à la connexion
                </Link>
            </div>
        </div>
    );
};

export default ResetPassword;
