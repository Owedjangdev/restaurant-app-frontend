import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        // Simulation d'appel API
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            toast.success('Email de récupération envoyé !');
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                    <Send size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Vérifiez vos emails</h2>
                <p className="text-gray-500">
                    Si un compte existe pour cet email, vous recevrez un lien pour réinitialiser votre mot de passe.
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
                <p className="text-gray-500 mt-1">Entrez votre email pour recevoir un lien de récupération</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Adresse Email"
                    type="email"
                    placeholder="nom@exemple.com"
                    icon={Mail}
                    required
                    {...register('email', { required: 'L\'email est requis' })}
                    error={errors.email?.message}
                />

                <Button
                    type="submit"
                    fullWidth
                    loading={loading}
                    icon={Send}
                >
                    Envoyer le lien
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
