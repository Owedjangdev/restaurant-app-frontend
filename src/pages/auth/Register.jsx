import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Phone, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';

// Schéma mis à jour : email OBLIGATOIRE
const registerSchema = z.object({
  fullName: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  phone: z.string().regex(/^\+229\d{8}$/, 'Format requis: +229XXXXXXXX'),
  email: z.string().email('Email invalide'), // ← Plus d'.optional() ni de chaîne vide
  address: z.string().min(5, 'L\'adresse est requise'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter les conditions' }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  const passwordStrength = password.length >= 12 ? 'Fort' : password.length >= 8 ? 'Moyen' : 'Faible';
  const strengthColor = passwordStrength === 'Fort' ? 'bg-green-500' : passwordStrength === 'Moyen' ? 'bg-yellow-500' : 'bg-red-500';

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register(data);
      toast.success('Compte créé avec succès ! Connectez-vous.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Créer un compte</h2>
        <p className="text-gray-500 mt-1">Rejoignez-nous pour commander plus facilement</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nom complet"
          placeholder="Jean Dupont"
          icon={User}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Téléphone"
            placeholder="+22901234567"
            icon={Phone}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Email" // ← Plus "(Optionnel)"
            type="email"
            placeholder="jean@exemple.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse principale</label>
          <textarea
            className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            rows="2"
            placeholder="Votre adresse complète..."
            {...register('address')}
          ></textarea>
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />
            {password && (
              <div className="mt-1">
                <div className="flex gap-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${strengthColor}`} style={{ width: passwordStrength === 'Fort' ? '100%' : passwordStrength === 'Moyen' ? '66%' : '33%' }}></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Force: {passwordStrength}</p>
              </div>
            )}
          </div>
          <Input
            label="Confirmer"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('acceptTerms')}
            />
          </div>
          <label htmlFor="acceptTerms" className="ml-2 block text-xs text-gray-600">
            J'accepte les <Link to="/terms" className="text-blue-600 hover:underline">Conditions Générales d'Utilisation</Link> et la politique de confidentialité.
          </label>
        </div>
        {errors.acceptTerms && <p className="text-xs text-red-600">{errors.acceptTerms.message}</p>}

        <Button
          type="submit"
          fullWidth
          loading={loading}
          icon={CheckCircle2}
          className="py-3 mt-4"
        >
          Créer mon compte
        </Button>
      </form>

      <div className="pt-2 text-center">
        <p className="text-sm text-gray-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;