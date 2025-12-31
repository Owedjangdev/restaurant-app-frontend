import React from 'react';
import { LogOut, Bell, User as UserIcon, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2.5 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <Menu size={24} />
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-blue-600 tracking-tighter">DELIVERY</span>
                    <span className="text-2xl font-light text-gray-400 tracking-tighter hidden sm:inline">PRO</span>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'Utilisateur'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Client'}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-2 border-white shadow-sm">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <UserIcon size={20} />
                        )}
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
                        title="Déconnexion"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
