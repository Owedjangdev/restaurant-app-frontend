import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Bell,
  User as UserIcon,
  Menu,
  Settings,
  LifeBuoy,
  ChevronDown,
  Package,
  Truck,
  Clock,
  X,
  UserPlus,
  CheckCircle
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

  useEffect(() => {
    if (user) {
      // Connect to socket
      connectSocket(user.id, user.role);

      // Fetch initial notifications
      const fetchNotifications = async () => {
        try {
          const data = await notificationService.getMyNotifications();
          setNotifications(data.notifications || []);
        } catch (error) {
          console.error('Erreur notifications:', error);
        }
      };
      fetchNotifications();

      // Socket listeners
      const handleNewNotification = (data) => {
        console.log('🔔 Nouvelle notification reçue:', data);
        const newNotif = {
          _id: data.notificationId || Date.now().toString(),
          type: data.type || 'ORDER_STATUS_UPDATE',
          message: data.message,
          createdAt: new Date(),
          isRead: false,
          relatedId: data.orderId || data.relatedId
        };

        setNotifications(prev => [newNotif, ...prev]);
        toast.success(data.message, {
          icon: '🔔',
          position: 'top-right'
        });
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
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
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

    // Navigation logic
    const role = user?.role;
    const relatedId = notif.relatedId;

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
    switch (type) {
      case 'ORDER_CREATED':
        return <Package size={18} className="text-blue-600" />;
      case 'ORDER_ASSIGNED':
      case 'ORDER_STATUS_UPDATE':
        return <Truck size={18} className="text-green-600" />;
      case 'ORDER_DELIVERED':
        return <CheckCircle size={18} className="text-emerald-600" />;
      case 'ACCOUNT_CREATED':
        return <UserPlus size={18} className="text-purple-600" />;
      default:
        return <Bell size={18} className="text-gray-600" />;
    }
  };

  const getTimeLabel = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMin = Math.floor((now - then) / 60000);
    if (diffInMin < 1) return 'À l\'instant';
    if (diffInMin < 60) return `${diffInMin} min`;
    const diffInHours = Math.floor(diffInMin / 60);
    if (diffInHours < 24) return `${diffInHours} h`;
    return then.toLocaleDateString();
  };

  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 h-16 flex items-center justify-between shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">Delivery</span>
          <span className="text-xl font-light text-gray-400 tracking-tight hidden sm:inline">Pro</span>
        </div>

        {/* Role Badge */}
        <div className="hidden md:flex ml-4 px-3 py-1 bg-blue-50 rounded-full">
          <span className="text-xs font-semibold text-blue-600 capitalize">
            {user?.role === 'client' ? '🛍️ Client' :
              user?.role === 'livreur' ? '🚚 Livreur' :
                user?.role === 'admin' ? '👨‍💼 Admin' : 'Utilisateur'}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full relative transition-colors"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={32} className="mx-auto mb-2 opacity-30" />
                    <p>Aucune notification</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50' : ''
                        }`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium text-gray-900 ${!notif.isRead ? 'font-bold' : ''}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{getTimeLabel(notif.createdAt)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif._id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-100 text-center">
                  <button
                    onClick={() => {
                      notificationService.deleteAll();
                      setNotifications([]);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Tout supprimer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-sm border border-blue-300">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="font-bold text-sm">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>

            <div className="hidden sm:flex flex-col items-start">
              <p className="text-sm font-semibold text-gray-900">
                {user?.fullName?.split(' ')[0] || 'Utilisateur'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || 'Client'}
              </p>
            </div>

            <ChevronDown size={18} className="text-gray-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white shadow-sm">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="font-bold">
                        {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user?.fullName || 'Utilisateur'}</p>
                    <p className="text-xs text-gray-500 text-ellipsis overflow-hidden">{user?.email || 'email@example.com'}</p>
                  </div>
                </div>
              </div>

              <div className="p-2 space-y-1">
                <button
                  onClick={() => {
                    navigate(
                      user?.role === 'admin' ? '/admin/settings' :
                        user?.role === 'livreur' ? '/livreur/profile' :
                          '/client/profile'
                    );
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <UserIcon size={18} />
                  <span className="text-sm font-medium">Mon Profil</span>
                </button>
              </div>

              <div className="p-2 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
