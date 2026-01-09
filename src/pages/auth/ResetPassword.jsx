import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(!!token);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="shadow-2xl max-w-md">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="text-red-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lien invalide</h2>
            <p className="text-gray-600 mb-6">
              Le lien de réinitialisation n'est pas valide ou est expiré.
            </p>
            <Link to="/forgot-password" className="block">
              <Button className="w-full">
                Demander un nouveau lien
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error('Tous les champs sont requis');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(token, newPassword);
      if (result.success) {
        setResetSuccess(true);
        toast.success('Mot de passe réinitialisé avec succès!');
      } else {
        setTokenValid(false);
        toast.error(result.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setTokenValid(false);
      toast.error('Lien expiré ou invalide');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 text-indigo-600 font-semibold mb-8 hover:text-indigo-700">
          <ArrowLeft size={18} />
          Retour à la connexion
        </Link>

        {!resetSuccess ? (
          <Card className="shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="text-indigo-600" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un nouveau mot de passe</h1>
              <p className="text-gray-600">Entrez votre nouveau mot de passe ci-dessous</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nouveau mot de passe"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={8}
                required
              />

              <Input
                label="Confirmer le mot de passe"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={8}
                required
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-700">
                  <strong>Conseils:</strong> Utilisez au moins 8 caractères avec une combinaison de lettres, chiffres et symboles.
                </p>
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                Réinitialiser le mot de passe
              </Button>
            </form>
          </Card>
        ) : (
          <Card className="shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Succès!</h2>
              <p className="text-gray-600 mb-8">
                Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>

              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Aller à la connexion
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
