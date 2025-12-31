import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    Truck,
    Search,
    UserPlus,
    MoreVertical,
    Mail,
    Phone,
    Shield,
    Ban,
    CheckCircle,
    Eye,
    Pencil
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { userService } from '../../services/userService';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
    const [activeTab, setActiveTab] = useState('client');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers(activeTab);
            setUsers(data.users || []);
        } catch (err) {
            // Fallback data for demo
            const fallbackData = activeTab === 'client'
                ? [
                    { _id: '1', fullName: 'Marie Kouassi', email: 'marie@example.com', phone: '+22997123456', active: true, createdAt: '2025-01-10' },
                    { _id: '2', fullName: 'Saliou Traoré', email: 'saliou@example.com', phone: '+22996111222', active: false, createdAt: '2025-01-12' },
                ]
                : [
                    { _id: '3', fullName: 'Jean Dupont', email: 'jean@delivery.com', phone: '+22990443322', active: true, createdAt: '2025-01-05', deliveries: 156 },
                    { _id: '4', fullName: 'Moussa Sarr', email: 'moussa@delivery.com', phone: '+22995887766', active: true, createdAt: '2025-01-08', deliveries: 42 },
                ];
            setUsers(fallbackData);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await userService.toggleUserStatus(user._id, !user.active);
            toast.success(`Compte ${user.active ? 'désactivé' : 'activé'} avec succès`);
            fetchUsers();
        } catch (err) {
            toast.error('Erreur lors du changement de statut');
        }
    };

    const filteredUsers = users.filter(u =>
        u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Utilisateurs</h1>
                    <p className="text-gray-500">Gérez les comptes clients et livreurs</p>
                </div>
                <Button icon={UserPlus}>Ajouter</Button>
            </div>

            {/* Tabs */}
            <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100 max-w-xs">
                <button
                    onClick={() => setActiveTab('client')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'client' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <UsersIcon size={18} />
                    Clients
                </button>
                <button
                    onClick={() => setActiveTab('livreur')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === 'livreur' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    <Truck size={18} />
                    Livreurs
                </button>
            </div>

            {/* Search and List */}
            <Card className="p-0 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <Input
                        placeholder={`Rechercher un ${activeTab}...`}
                        icon={Search}
                        containerClassName="mb-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white border-b border-gray-50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Utilisateur</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date Inscr.</th>
                                {activeTab === 'livreur' && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Livraisons</th>}
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 bg-white">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <div className="font-bold text-gray-900">{user.fullName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="text-sm flex items-center gap-1.5 text-gray-700">
                                            <Mail size={12} className="text-gray-400" /> {user.email || '—'}
                                        </div>
                                        <div className="text-sm flex items-center gap-1.5 text-gray-700">
                                            <Phone size={12} className="text-gray-400" /> {user.phone}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.active ? <CheckCircle size={12} className="mr-1" /> : <Ban size={12} className="mr-1" />}
                                            {user.active ? 'Actif' : 'Suspendu'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    {activeTab === 'livreur' && (
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">{user.deliveries || 0}</span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={18} /></button>
                                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Pencil size={18} /></button>
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-2 rounded-lg transition-all ${user.active ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                                            >
                                                {user.active ? <Ban size={18} /> : <CheckCircle size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminUsers;
