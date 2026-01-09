import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Bell,
  User as UserIcon,
  Menu,
  X,
  UserPlus,
  CheckCircle,
  Truck,
  Package,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import socket, { connectSocket } from '../../utils/socket';
import { notificationService } from '../../services/notificationService';
import { toast } from 'react-hot-toast';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      connectSocket(user.id, user.role);
      const fetchNotifications = async () => {
        try {
          const data = await notificationService.getMyNotifications();
          setNotifications(data.notifications || []);
        } catch (error) {
          console.error('Erreur notifications:', error);
        }
      };
      fetchNotifications();

      const handleNewNotification = (data) => {
        const newNotif = {
          _id: data.notificationId || Date.now().toString(),
          type: data.type || 'ORDER_STATUS_UPDATE',
          message: data.message,
          createdAt: new Date(),
          isRead: false,
          relatedId: data.orderId || data.relatedId
        };

        setNotifications(prev => [newNotif, ...prev]);
        toast.success(data.message, { icon: '🔔', position: 'top-right' });
      };

      socket.on('new-order', (data) => handleNewNotification({ ...data, type: 'ORDER_CREATED' }));
      socket.on('order-assigned', (data) => handleNewNotification({ ...data, type: 'ORDER_ASSIGNED' }));
      socket.on('order-status-update', (data) => handleNewNotification({ ...data, type: 'ORDER_STATUS_UPDATE' }));
      socket.on('order-delivered', (data) => handleNewNotification({ ...data, type: 'ORDER_DELIVERED' }));
      socket.on('account-created', (data) => handleNewNotification({ ...data, type: 'ACCOUNT_CREATED' }));

      return () => {
        socket.off('new-order');
        socket.off('order-assigned');
        socket.off('order-status-update');
        socket.off('order-delivered');
        socket.off('account-created');
      };
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif._id);
    setShowNotifications(false);
    const role = user?.role;

    if (notif.type === 'ORDER_CREATED' || notif.type === 'ORDER_DELIVERED') {
      if (role === 'admin') navigate(`/admin/orders`);
    } else if (notif.type === 'ORDER_ASSIGNED') {
      if (role === 'livreur') navigate(`/livreur/dashboard`);
    } else if (notif.type === 'ORDER_STATUS_UPDATE') {
      if (role === 'client') navigate(`/client/orders`);
      if (role === 'admin') navigate(`/admin/orders`);
    } else if (notif.type === 'ACCOUNT_CREATED') {
      if (role === 'livreur') navigate(`/livreur/profile`);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClass = "w-full h-full p-1.5";
    switch (type) {
      case 'ORDER_CREATED': return <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600"><Package className={iconClass} /></div>;
      case 'ORDER_ASSIGNED': return <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600"><Truck className={iconClass} /></div>;
      case 'ORDER_STATUS_UPDATE': return <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600"><Truck className={iconClass} /></div>;
      case 'ORDER_DELIVERED': return <div className="w-8 h-8 rounded-full bg-green-100 text-green-600"><CheckCircle className={iconClass} /></div>;
      case 'ACCOUNT_CREATED': return <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600"><UserPlus className={iconClass} /></div>;
      default: return <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600"><Bell className={iconClass} /></div>;
    }
  };

  const getTimeLabel = (date) => {
    const diffInMin = Math.floor((new Date() - new Date(date)) / 60000);
    if (diffInMin < 1) return 'À l\'instant';
    if (diffInMin < 60) return `${diffInMin} min`;
    const diffInHours = Math.floor(diffInMin / 60);
    if (diffInHours < 24) return `${diffInHours} h`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100/50' : 'bg-white border-b border-gray-100'
      }`}>
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Left Section: Menu & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 lg:hidden text-gray-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all active:scale-95"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300 group-hover:scale-105">
                  <span className="font-black text-xl tracking-tighter">D</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                  Delivery<span className="text-blue-600">Pro</span>
                </h1>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none mt-1">
                  {user?.role === 'admin' ? 'Administration' : user?.role === 'livreur' ? 'Espace Livreur' : 'Espace Client'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-3 sm:gap-6">

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all duration-200 active:scale-95 ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <div className="relative">
                  <Bell size={22} strokeWidth={2} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => { notificationService.deleteAll(); setNotifications([]); }}
                          className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                          Tout effacer
                        </button>
                      )}
                    </div>

                    <div className="max-h-[28rem] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                          <Bell size={48} className="mb-3 opacity-10" />
                          <p className="text-sm font-medium">Aucune notification</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer flex gap-4 ${!notif.isRead ? 'bg-blue-50/30' : ''
                              }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                {notif.message}
                              </p>
                              <span className="text-xs text-gray-400 mt-1 block font-medium">
                                {getTimeLabel(notif.createdAt)}
                              </span>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                              className="text-gray-300 hover:text-red-500 transition-colors self-start p-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 p-1 pl-2 pr-4 rounded-full hover:bg-gray-100/80 transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-white">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="font-bold text-sm">{user?.fullName?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-bold text-gray-700 leading-none">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase leading-none mt-1">
                    {user?.role}
                  </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)}></div>
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                    <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                          <span className="font-bold text-lg">{user?.fullName?.charAt(0) || 'U'}</span>
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-900 truncate">{user?.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 border border-blue-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">En ligne</span>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate(user?.role === 'admin' ? '/admin/settings' : user?.role === 'livreur' ? '/livreur/profile' : '/client/profile');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all group"
                      >
                        <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <UserIcon size={18} />
                        </div>
                        <span className="font-medium">Mon Profil</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-gray-50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                      >
                        <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                          <LogOut size={18} />
                        </div>
                        <span className="font-medium">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
