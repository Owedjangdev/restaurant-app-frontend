import React, { useState } from 'react';
import { Mail, MessageCircle, Phone, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Support = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    email: '',
    category: 'technical',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/support/ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Ticket créé avec succès');
        setSubmitted(true);
        setFormData({
          subject: '',
          email: '',
          category: 'technical',
          message: ''
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      toast.error('Erreur serveur');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: 'Comment passer une commande?',
      answer: 'Accédez à la section "Nouvelle commande" dans votre tableau de bord, remplissez les détails de votre livraison et confirmez. Un livreur sera assigné automatiquement.'
    },
    {
      question: 'Comment suivre ma commande?',
      answer: 'Vous pouvez suivre votre commande en temps réel dans la section "Mes commandes" avec la localisation GPS du livreur.'
    },
    {
      question: 'Quels sont les délais de livraison?',
      answer: 'Les délais varient selon votre localisation et la disponibilité des livreurs. En général, 30-60 minutes en zone urbaine.'
    },
    {
      question: 'Comment annuler une commande?',
      answer: 'Vous pouvez annuler une commande avant que le livreur ne la prenne en charge via l\'option "Annuler" dans les détails de la commande.'
    },
    {
      question: 'Que faire en cas de problème de livraison?',
      answer: 'Contactez-nous immédiatement via le formulaire de support avec les détails de votre commande. Notre équipe intervendra rapidement.'
    },
    {
      question: 'Comment devenir livreur?',
      answer: 'Allez à la page d\'inscription et sélectionnez le rôle "Livreur". Complétez votre profil avec les documents requis pour activation.'
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@restaurant-app.com',
      desc: 'Réponse en 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+229 00 00 00 00',
      desc: 'Lun-Ven 9h-18h'
    },
    {
      icon: MessageCircle,
      title: 'Chat',
      value: 'Chat en ligne',
      desc: 'Instantané'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Centre d'Aide</h1>
          <p className="text-blue-100 text-lg">Nous sommes là pour vous aider 24h/24</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'contact'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'faq'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            FAQ
          </button>
        </div>

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Methods */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Contactez-nous</h2>
              <div className="space-y-4">
                {contactMethods.map((method, idx) => {
                  const Icon = method.icon;
                  return (
                    <div key={idx} className="flex gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                      <div className="flex-shrink-0">
                        <Icon size={24} className="text-blue-600 mt-1" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{method.title}</h3>
                        <p className="text-gray-600 font-medium">{method.value}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Support Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle size={48} className="text-green-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Merci!</h3>
                  <p className="text-gray-600">Votre ticket de support a été créé avec succès. Notre équipe vous contactera dans les 24h.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Créer un ticket</h2>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sujet</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Décrivez brièvement votre problème"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="technical">Problème technique</option>
                      <option value="billing">Facturation</option>
                      <option value="delivery">Livraison</option>
                      <option value="account">Compte</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Décrivez votre problème en détail..."
                      rows="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le ticket'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions Fréquentes</h2>
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden group">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-3">
                    <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
                    {faq.question}
                  </span>
                </summary>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
