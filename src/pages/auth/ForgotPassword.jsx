import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetToken, setResetToken] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await authService.forgotPassword(data.email);
            
            if (response.success) {
                console.log('✅ Reset token reçu:', response.resetToken);
                setResetToken(response.resetToken);
                setSubmitted(true);
                toast.success('Email valide ! Redirection vers réinitialisation...');
                
                // Rediriger vers reset password après 2s
                setTimeout(() => {
                    navigate('/reset-password', { 
                        state: { resetToken: response.resetToken, email: data.email } 
                    });
                }, 2000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Erreur lors de la vérification';
            toast.error(errorMessage);
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                    <Send size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Email vérifié !</h2>
                <p className="text-gray-500">
                    Redirection vers la réinitialisation du mot de passe...
                </p>
                <div className="pt-4">
                    <Link to="/login">
                        <Button variant="outline" icon={ArrowLeft} fullWidth>
                            Retour à la connexion
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Mot de passe oublié ?</h2>
                <p className="text-gray-500 mt-1">Entrez votre email pour réinitialiser votre mot de passe</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Adresse Email"
                    type="email"
                    placeholder="nom@exemple.com"
                    icon={Mail}
                    {...register('email', { 
                        required: 'L\'email est requis',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email invalide'
                        }
                    })}
                    error={errors.email?.message}
                />

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Vérification...' : 'Envoyer le lien'}
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

export default ForgotPassword;
