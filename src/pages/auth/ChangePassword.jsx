import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { changePassword, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Tous les champs sont requis');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (currentPassword === newPassword) {
      toast.error('Le nouveau mot de passe doit être différent de l\'ancien');
      return;
    }

    setLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        toast.success('Mot de passe changé avec succès!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Rediriger selon le rôle
        const roleRoutes = {
          admin: '/admin/dashboard',
          client: '/client/dashboard',
          livreur: '/livreur/dashboard',
        };
        setTimeout(() => navigate(roleRoutes[user?.role] || '/login'), 1500);
      } else {
        toast.error(result.message || 'Une erreur est survenue');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || 'Erreur lors du changement de mot de passe';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:text-indigo-700"
        >
          <ArrowLeft size={18} />
          Retour
        </button>

        <Card className="shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-indigo-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Changer votre mot de passe</h1>
            <p className="text-gray-600">Mettez à jour votre mot de passe pour sécuriser votre compte</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Mot de passe actuel"
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Nouveau mot de passe</h3>
              
              <Input
                label="Nouveau mot de passe"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />

              <div className="mt-4">
                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-700">
                <strong>Conseils de sécurité:</strong> Utilisez au moins 8 caractères avec une combinaison de lettres majuscules, minuscules, chiffres et symboles.
              </p>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              Confirmer le changement
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
