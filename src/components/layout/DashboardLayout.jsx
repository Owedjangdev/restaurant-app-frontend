import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    Truck,
    Settings,
    PlusCircle,
    History,
    X
} from 'lucide-react';
import Navbar from '../common/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { connectSocket, disconnectSocket } from '../../utils/socket';
import { useEffect } from 'react';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            connectSocket(user.id || user._id, user.role);
        }
        return () => disconnectSocket();
    }, [user]);

    const adminMenu = [
        { label: 'Tableau de bord', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Commandes', icon: Package, path: '/admin/orders' },
        { label: 'Recrutement', icon: Truck, path: '/admin/deliveries' },
        { label: 'Utilisateurs', icon: Users, path: '/admin/users' },
        { label: 'Paramètres', icon: Settings, path: '/admin/settings' },
    ];

    const clientMenu = [
        { label: 'Accueil', icon: LayoutDashboard, path: '/client/dashboard' },
        { label: 'Nouvelle Commande', icon: PlusCircle, path: '/client/new-order' },
        { label: 'Mes Commandes', icon: Package, path: '/client/orders' },
    ];

    const livreurMenu = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/livreur/dashboard' },
        { label: 'Mes Livraisons', icon: Truck, path: '/livreur/deliveries' },
        { label: 'Historique', icon: History, path: '/livreur/history' },
    ];

    const getMenu = () => {
        switch (user?.role) {
            case 'admin': return adminMenu;
            case 'livreur': return livreurMenu;
            case 'client': return clientMenu;
            default: return [];
        }
    };

    const menuItems = getMenu();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar for Desktop */}
                <aside className="hidden lg:flex w-64 flex-col bg-white border-r border-gray-100 overflow-y-auto">
                    <div className="p-6 flex-1">
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}
                  `}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                        <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col animate-slide-in">
                            <div className="p-6 flex items-center justify-between border-b border-gray-100">
                                <span className="text-xl font-bold text-blue-600">MENU</span>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto">
                                <nav className="space-y-2">
                                    {menuItems.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={({ isActive }) => `
                        flex items-center gap-4 px-4 py-4 rounded-xl transition-all
                        ${isActive
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                    : 'text-gray-700 hover:bg-gray-50'}
                      `}
                                        >
                                            <item.icon size={22} />
                                            <span className="font-semibold">{item.label}</span>
                                        </NavLink>
                                    ))}
                                </nav>
                            </div>
                        </aside>
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
