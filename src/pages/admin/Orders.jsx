import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Clock, MapPin, Truck, ChevronRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import socket from '../../utils/socket';
import Loader from '../../components/common/Loader';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedLivreur, setSelectedLivreur] = useState('');
  const [assigning, setAssigning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, deliveriesData] = await Promise.all([
          adminService.getAllOrders(),
          adminService.getAllUsers({ role: 'livreur', isVerified: true })
        ]);

        console.log('📦 Commandes:', ordersData);
        console.log('🚚 Livreurs:', deliveriesData);

        setOrders(ordersData.orders || []);
        setDeliveries(deliveriesData.users || []);
      } catch (err) {
        console.error('❌ Erreur fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    socket.on('new-order', (data) => {
      console.log('🔔 Nouvelle commande reçue en temps réel:', data);

      // Construire l'objet commande à partir des données reçues
      const newOrder = {
        _id: data.orderId,
        user: { fullName: data.clientName, phone: data.clientPhone },
        deliveryAddress: data.deliveryAddress,
        description: data.description,
        status: 'PENDING',
        createdAt: data.createdAt || new Date().toISOString(),
        livreur: null
      };

      setOrders(prev => [newOrder, ...prev]);
      toast.success(`Nouveau: ${data.message}`, {
        icon: '🎁',
        duration: 5000
      });
    });

    return () => {
      socket.off('new-order');
    };
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && order.status === 'PENDING') ||
      (filter === 'assigned' && order.status === 'ASSIGNED') ||
      (filter === 'in_delivery' && order.status === 'IN_DELIVERY') ||
      (filter === 'delivered' && order.status === 'DELIVERED');

    const matchesSearch =
      searchTerm === '' ||
      searchTerm === '' ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleAssign = async () => {
    if (!selectedLivreur) {
      toast.error('Veuillez sélectionner un livreur');
      return;
    }

    setAssigning(true);
    try {
      const response = await adminService.assignOrderToDelivery(selectedOrder._id, selectedLivreur);

      console.log('✅ Allocation réussie:', response);

      // Mettre à jour la liste locale
      setOrders(prevOrders => prevOrders.map(o =>
        o._id === selectedOrder._id
          ? { ...o, status: 'ASSIGNED', livreur: deliveries.find(d => d._id === selectedLivreur) }
          : o
      ));

      toast.success(`✅ Commande assignée à ${response.order?.livreur?.fullName || 'livreur'}!`);
      setShowAssignModal(false);
      setSelectedOrder(null);
      setSelectedLivreur('');
    } catch (err) {
      console.error('❌ Erreur assign:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de l\'assignation de la commande');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Commandes</h1>
        <p className="text-gray-500">Suivi et gestion de toutes les commandes</p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'assigned', 'in_delivery', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {status === 'all' ? 'Toutes' : status === 'pending' ? 'En attente' :
                status === 'assigned' ? 'Assignées' : status === 'in_delivery' ? 'En cours' : 'Livrées'}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Chercher par ID, client ou adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">Aucune commande trouvée</p>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order._id} hoverable className="transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      Commande #{order._id?.substring(0, 8) || 'N/A'}
                    </h3>
                    <Badge status={order.status} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Client</p>
                      <p className="font-medium text-gray-900">{order.user?.fullName || 'Anonyme'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{order.receiverPhone}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex gap-2 items-start">
                      <MapPin size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">{order.deliveryAddress}</p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Truck size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">
                        Livreur: <span className="font-medium">{order.livreur?.fullName || 'Non assigné'}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 items-start">
                      <Clock size={18} className="text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-700">
                        {order.createdAt ? (
                          <>
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')} à{' '}
                            {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </>
                        ) : 'Date inconnue'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Contenu:</strong> {order.description}
                    </p>
                  </div>
                </div>

                <div className="ml-6 flex flex-col gap-2">
                  {order.status === 'PENDING' && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowAssignModal(true);
                      }}
                    >
                      Assigner
                    </Button>
                  )}
                  <Link to={`/admin/orders/${order._id}`}>
                    <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                      Détails
                      <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Assigner une commande
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                Commande #{selectedOrder._id.substring(0, 8)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner un livreur
                </label>
                <select
                  value={selectedLivreur}
                  onChange={(e) => setSelectedLivreur(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Choisir un livreur --</option>
                  {deliveries.map((livreur) => (
                    <option key={livreur._id} value={livreur._id}>
                      {livreur.fullName} ({livreur.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Annuler
                </button>
                <Button
                  onClick={handleAssign}
                  loading={assigning}
                  disabled={!selectedLivreur || assigning}
                  className="flex-1"
                >
                  Confirmer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
