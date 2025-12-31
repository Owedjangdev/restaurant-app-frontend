import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    UserPlus,
    Calendar,
    RefreshCcw,
    User as UserIcon
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [livreurs, setLivreurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });

    useEffect(() => {
        fetchOrders();
        fetchLivreurs();
    }, [filters.status]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = filters.status !== 'all' ? { status: filters.status } : {};
            const data = await orderService.getAllOrders(params);
            setOrders(data.orders || []);
        } catch (err) {
            toast.error('Erreur lors du chargement des commandes');
        } finally {
            setLoading(false);
        }
    };

    const fetchLivreurs = async () => {
        try {
            // In a real app we'd have a getUsers endpoint filtered by role
            const data = await api.get('/users?role=livreur');
            setLivreurs(data.data.users || []);
        } catch (err) {
            // Fallback pseudo-data for demo
            setLivreurs([
                { _id: '1', fullName: 'Jean Dupont', activeOrders: 2, avatar: null },
                { _id: '2', fullName: 'Moussa Sarr', activeOrders: 0, avatar: null },
                { _id: '3', fullName: 'Alice Kouassi', activeOrders: 5, avatar: null },
            ]);
        }
    };

    const handleOpenAssign = (order) => {
        setSelectedOrder(order);
        setIsAssignModalOpen(true);
    };

    const handleAssign = async (livreurId) => {
        try {
            await orderService.assignOrder(selectedOrder._id, livreurId);
            toast.success('Livreur assigné avec succès');
            setIsAssignModalOpen(false);
            fetchOrders();
        } catch (err) {
            toast.error('Erreur lors de l\'assignation');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Gestion des Commandes</h1>
                    <p className="text-gray-500">Gérez et affectez les livraisons entrantes</p>
                </div>
                <Button variant="outline" icon={RefreshCcw} onClick={fetchOrders} loading={loading}>
                    Rafraîchir
                </Button>
            </div>

            {/* Filters Bar */}
            <Card className="p-4 border-none shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <Input
                        placeholder="Rechercher par N° ou client..."
                        icon={Search}
                        containerClassName="flex-1 mb-0"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            className="rounded-lg border-gray-100 bg-gray-50 text-sm font-medium focus:ring-blue-500 focus:border-blue-500 py-2 pl-4 pr-10"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="all">Tous les statuts</option>
                            <option value="pending">En attente</option>
                            <option value="assigned">Assignées</option>
                            <option value="in_delivery">En cours</option>
                            <option value="delivered">Livrées</option>
                        </select>
                        <Button variant="secondary" icon={Filter}>Filtres</Button>
                    </div>
                </div>
            </Card>

            {/* Orders Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto -mx-6">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-y border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Commande</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Client & Adresse</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Livreur</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-xs text-blue-600 font-bold">#{order._id.substring(0, 8)}</div>
                                        <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                            <Calendar size={10} /> {formatDate(order.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{order.client?.fullName}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[200px]">{order.deliveryAddress}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {order.livreur ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <UserIcon size={12} />
                                                </div>
                                                <span className="font-medium">{order.livreur.fullName}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">Non assigné</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {order.status === ORDER_STATUS.PENDING ? (
                                                <Button
                                                    size="sm"
                                                    icon={UserPlus}
                                                    onClick={() => handleOpenAssign(order)}
                                                >
                                                    Assigner
                                                </Button>
                                            ) : (
                                                <Button variant="ghost" size="sm" icon={Eye}>Détail</Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Assignment Modal */}
            <Modal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                title="Assigner un livreur"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">Choisissez un livreur disponible pour la commande <strong>#{selectedOrder?._id.substring(0, 8)}</strong></p>
                    <div className="space-y-2">
                        {livreurs.map((l) => (
                            <div
                                key={l._id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all group cursor-pointer"
                                onClick={() => handleAssign(l._id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
                                        <UserIcon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 group-hover:text-blue-600">{l.fullName}</p>
                                        <p className="text-xs text-gray-500">{l.activeOrders} commandes en cours</p>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${l.activeOrders >= 3 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                    {l.activeOrders >= 3 ? 'Occupé' : 'Disponible'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminOrders;
