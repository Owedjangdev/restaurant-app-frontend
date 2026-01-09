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
    Pencil,
    Trash2
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
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // view, edit, create
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });

    useEffect(() => {
        fetchUsers();
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers(activeTab);
            setUsers(data.users || []);
        } catch (err) {
            console.error('Erreur récupération utilisateurs:', err);
            toast.error('Erreur lors de la récupération des utilisateurs');
            setUsers([]);
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
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.includes(searchTerm)
    );

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        if (user) {
            setSelectedUser(user);
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                password: '' // Don't show password
            });
        } else {
            setSelectedUser(null);
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                address: '',
                password: 'client123'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (modalMode === 'create') {
                await userService.createUser({ ...formData, role: activeTab });
                toast.success(`${activeTab === 'client' ? 'Client' : 'Livreur'} créé avec succès`);
            } else if (modalMode === 'edit') {
                await userService.updateUser(selectedUser._id, formData);
                toast.success('Informations mises à jour');
            }
            handleCloseModal();
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;

        setIsDeleting(true);
        try {
            await userService.deleteUser(userToDelete._id);
            toast.success('Utilisateur supprimé avec succès');
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Utilisateurs</h1>
                    <p className="text-gray-500">Gérez les comptes clients et livreurs</p>
                </div>
                <Button icon={UserPlus} onClick={() => handleOpenModal('create')}>Ajouter</Button>
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
                                                {user.fullName?.charAt(0) || '?'}
                                            </div>
                                            <div className="font-bold text-gray-900">{user.fullName || 'Inconnu'}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-1">
                                        <div className="text-sm flex items-center gap-1.5 text-gray-700">
                                            <Mail size={12} className="text-gray-400" /> {user.email || '—'}
                                        </div>
                                        <div className="text-sm flex items-center gap-1.5 text-gray-700">
                                            <Phone size={12} className="text-gray-400" /> {user.phone || '—'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.active !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.active !== false ? <CheckCircle size={12} className="mr-1" /> : <Ban size={12} className="mr-1" />}
                                            {user.active !== false ? 'Actif' : 'Suspendu'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                                    </td>
                                    {activeTab === 'livreur' && (
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">{user.deliveries || 0}</span>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal('view', user)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal('edit', user)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-2 rounded-lg transition-all ${user.active ? 'text-gray-400 hover:text-red-600 hover:bg-red-50' : 'text-gray-400 hover:text-green-600 hover:bg-green-50'}`}
                                                title={user.active ? 'Suspendre' : 'Activer'}
                                            >
                                                {user.active ? <Ban size={18} /> : <CheckCircle size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Supprimer définitivement"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={
                    modalMode === 'create' ? `Ajouter un ${activeTab === 'client' ? 'Client' : 'Livreur'}` :
                        modalMode === 'edit' ? 'Modifier l\'utilisateur' : 'Détails de l\'utilisateur'
                }
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nom complet"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            disabled={modalMode === 'view'}
                            required
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={modalMode === 'view'}
                            required={modalMode === 'create'}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Téléphone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            disabled={modalMode === 'view'}
                            required
                        />
                        {modalMode === 'create' && (
                            <Input
                                label="Mot de passe"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        )}
                    </div>
                    <Input
                        label="Adresse"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={modalMode === 'view'}
                    />

                    {modalMode !== 'view' && (
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                fullWidth
                                onClick={handleCloseModal}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                loading={isSaving}
                            >
                                {modalMode === 'create' ? 'Créer' : 'Enregistrer'}
                            </Button>
                        </div>
                    )}
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                title="Confirmer la suppression"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl text-red-700">
                        <div className="p-2 bg-red-100 rounded-xl">
                            <Trash2 size={24} />
                        </div>
                        <div>
                            <p className="font-bold">Action irréversible</p>
                            <p className="text-sm opacity-90">
                                Êtes-vous sûr de vouloir supprimer définitivement l'utilisateur <strong>{userToDelete?.fullName}</strong> ?
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            fullWidth
                            loading={isDeleting}
                            onClick={confirmDelete}
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUsers;
