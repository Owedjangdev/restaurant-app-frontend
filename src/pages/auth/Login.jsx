import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService'; // ✅ Import authService
import useAuthStore from '../../store/authStore'; // ✅ Import useAuthStore

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate(); // ✅ Ajout de useNavigate
  const { login: loginStore } = useAuthStore(); // ✅ Récupère la fonction login du store
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      // ✅ 1. Appeler le backend via authService
      const response = await authService.login({
        email: data.email,
        password: data.password
      });

      // ✅ 2. Sauvegarder dans le store Zustand
      loginStore(response.user, response.token);

      // ✅ 3. Afficher le message de succès
      toast.success('Connexion réussie !');

      // ✅ 4. Rediriger selon le rôle
      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (response.user.role === 'livreur') {
        navigate('/livreur/dashboard');
      } else {
        navigate('/client/dashboard');
      }

    } catch (err) {
      console.error('Erreur login:', err);
      
      const errorMessage = err.response?.data?.message || 'Erreur de connexion';
      setError(errorMessage);
      toast.error(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Bienvenue !</h2>
        <p className="text-gray-500 mt-1">Connectez-vous pour gérer vos livraisons</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-shake">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Adresse Email"
          type="email"
          placeholder="nom@exemple.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Mot de passe"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              {...register('rememberMe')}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Se souvenir de moi
            </label>
          </div>

          <Link 
            to="/forgot-password" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          icon={LogIn}
          className="py-3"
        >
          Se connecter
        </Button>
      </form>

      <div className="pt-2 text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link 
            to="/register" 
            className="font-bold text-blue-600 hover:text-blue-500 underline-offset-4 hover:underline"
          >
            S'inscrire (Client uniquement)
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
