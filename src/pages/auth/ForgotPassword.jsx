import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setEmailSent(true);
        toast.success('Email de réinitialisation envoyé!');
      } else {
        toast.error(result.message || 'Une erreur est survenue');
      }
    } catch (err) {
      toast.error('Erreur lors de l\'envoi de l\'email');
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

        {!emailSent ? (
          <Card className="shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-indigo-600" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mot de passe oublié?</h1>
              <p className="text-gray-600">Entrez votre email pour recevoir un lien de réinitialisation</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                Envoyer le lien
              </Button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Vous vous souvenez de votre mot de passe?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Connexion
              </Link>
            </p>
          </Card>
        ) : (
          <Card className="shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé!</h2>
              <p className="text-gray-600 mb-6">
                Nous avons envoyé un lien de réinitialisation à <strong>{email}</strong>
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-blue-800">
                  📧 <strong>Vérifiez votre email</strong> et cliquez sur le lien pour réinitialiser votre mot de passe.
                </p>
                <p className="text-xs text-blue-600 mt-2">
                  Le lien expire dans 15 minutes.
                </p>
              </div>

              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Retour à la connexion
              </Button>

              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="mt-4 text-indigo-600 font-semibold hover:underline text-sm"
              >
                Réessayer avec un autre email
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
