import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Truck, Phone, MapPin, Award, UserPlus, Mail, Lock, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-hot-toast';

const AdminDeliveries = () => {
  const [pendingDeliveries, setPendingDeliveries] = useState([]);
  const [allDeliveries, setAllDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [verifying, setVerifying] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state for new delivery person
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: 'livreur123', // Default password
    vehicleType: 'moto',
    licensePlate: '',
    address: ''
  });

  const fetchDeliveries = async () => {
    try {
      const [pendingData, allData] = await Promise.all([
        adminService.getDeliveryApplications(),
        adminService.getAllUsers({ role: 'livreur' })
      ]);

      setPendingDeliveries(pendingData.users || []);
      setAllDeliveries(allData.users || []);
    } catch (err) {
      console.error('❌ Erreur fetch deliveries:', err);
      toast.error('Erreur lors de la récupération des livreurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleVerify = async (userId) => {
    setVerifying(prev => ({ ...prev, [userId]: true }));
    try {
      await adminService.verifyDelivery(userId);
      toast.success('✅ Livreur vérifié avec succès!');
      fetchDeliveries();
    } catch (err) {
      console.error('❌ Erreur verify:', err);
      toast.error('Erreur lors de la vérification');
    } finally {
      setVerifying(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir rejeter cette demande?')) return;

    setVerifying(prev => ({ ...prev, [userId]: true }));
    try {
      await adminService.rejectDelivery(userId);
      toast.success('❌ Demande rejetée');
      fetchDeliveries();
    } catch (err) {
      console.error('❌ Erreur reject:', err);
      toast.error('Erreur lors du rejet');
    } finally {
      setVerifying(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await adminService.createDelivery(formData);
      toast.success('✅ Nouveau livreur recruté avec succès!');
      setShowAddModal(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: 'livreur123',
        vehicleType: 'moto',
        licensePlate: '',
        address: ''
      });
      fetchDeliveries();
    } catch (err) {
      console.error('❌ Erreur creation:', err);
      toast.error(err.response?.data?.message || 'Erreur lors du recrutement');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <Loader fullPage />;

  const verifiedDeliveries = allDeliveries.filter(d => d.isVerified);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Livreurs</h1>
          <p className="text-gray-500">Recrutement et vérification des livreurs</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <UserPlus size={18} />
          Recruter un livreur
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab('pending')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${tab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
        >
          Demandes en attente ({pendingDeliveries.length})
        </button>
        <button
          onClick={() => setTab('verified')}
          className={`px-4 py-3 font-semibold border-b-2 transition-colors ${tab === 'verified'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
        >
          Livreurs actifs ({verifiedDeliveries.length})
        </button>
      </div>

      {/* Pending Deliveries */}
      {tab === 'pending' && (
        <div className="space-y-4">
          {pendingDeliveries.length === 0 ? (
            <Card className="text-center py-12">
              <ShieldCheck size={48} className="text-green-500 mx-auto mb-4" />
              <p className="text-gray-500 font-medium italic">Aucune demande d'inscription en attente</p>
            </Card>
          ) : (
            pendingDeliveries.map((delivery) => (
              <Card key={delivery._id} className="overflow-hidden border-l-4 border-l-amber-400">
                <div className="flex items-start justify-between">
                  {/* ... same as before but cleaner ... */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{delivery.fullName}</h3>
                      <Badge status="PENDING">Nouvelle candidature</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mt-4">
                      <div className="flex gap-2 italic">
                        <Phone size={18} className="text-blue-500 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Téléphone</p>
                          <p className="font-medium text-gray-900">{delivery.phone}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <MapPin size={18} className="text-red-500 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Adresse</p>
                          <p className="font-medium text-gray-900">{delivery.address}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Truck size={18} className="text-green-500 flex-shrink-0" />
                        <div>
                          <p className="text-gray-500 text-xs">Véhicule</p>
                          <p className="font-medium text-gray-900 capitalize">{delivery.vehicleType}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerify(delivery._id)}
                      loading={verifying[delivery._id]}
                      className="bg-green-600"
                    >
                      Approuver
                    </Button>
                    <button
                      onClick={() => handleReject(delivery._id)}
                      disabled={verifying[delivery._id]}
                      className="text-red-600 hover:bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg text-sm font-bold"
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Verified Deliveries */}
      {tab === 'verified' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {verifiedDeliveries.length === 0 ? (
            <div className="col-span-full">
              <Card className="text-center py-12">
                <Truck size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 italic font-medium">Recrutez votre premier livreur pour commencer!</p>
              </Card>
            </div>
          ) : (
            verifiedDeliveries.map((delivery) => (
              <Card key={delivery._id} className="relative hover:shadow-md transition-shadow border-t-4 border-t-blue-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xl">
                    {delivery.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{delivery.fullName}</h3>
                    <p className="text-xs text-gray-500">{delivery.email}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Téléphone</span>
                    <span className="font-medium">{delivery.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-500">Véhicule</span>
                    <span className="font-medium capitalize">{delivery.vehicleType}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Note</span>
                    <span className="font-bold text-amber-500">⭐ {delivery.rating || 5}.0</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Badge status="ASSIGNED" className="w-full justify-center">Optionnel: Actif</Badge>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Recruitment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
          <Card className="w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recruter un nouveau livreur</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XCircle size={24} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nom complet"
                  placeholder="Ex: Jean Dupont"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  icon={ShieldCheck}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="ex@restaurant.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  icon={Mail}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Téléphone"
                  placeholder="+243..."
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  icon={Phone}
                />
                <Input
                  label="Mot de passe par défaut"
                  type="text"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  icon={Lock}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type de véhicule</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-gray-50"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                >
                  <option value="moto">Moto</option>
                  <option value="velo">Velo</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Plaque (Optionnel)"
                  placeholder="ABC-001"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                  icon={Truck}
                />
                <Input
                  label="Adresse"
                  placeholder="Quartier, Avenue..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  icon={MapPin}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Annuler
                </button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={creating}
                >
                  Valider le recrutement
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveries;
