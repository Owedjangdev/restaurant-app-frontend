import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Truck,
  MapPin,
  BarChart3,
  Clock,
  LogOut,
  Menu,
  X,
  Home,
  History,
  User,
  Star,
  AlertCircle,
  Activity,
  Bell,
  CheckCircle,
  UserPlus,
  Package
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import socket, { connectSocket } from '../../utils/socket';
import { notificationService } from '../../services/notificationService';

const LivreurHeader = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ active: 0, completed: 0, rating: 5 });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      connectSocket(user.id, user.role);

      const fetchNotifications = async () => {
        try {
          const data = await notificationService.getMyNotifications();
          setNotifications(data.notifications || []);
        } catch (error) {
          console.error(error);
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
        toast.success(data.message, { icon: '🔔' });
      };

      socket.on('order-assigned', (data) => handleNewNotification({ ...data, type: 'ORDER_ASSIGNED' }));
      socket.on('order-status-update', (data) => handleNewNotification({ ...data, type: 'ORDER_STATUS_UPDATE' }));
      socket.on('account-created', (data) => handleNewNotification({ ...data, type: 'ACCOUNT_CREATED' }));

      return () => {
        socket.off('order-assigned');
        socket.off('order-status-update');
        socket.off('account-created');
      };
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notif) => {
    try {
      await notificationService.markAsRead(notif._id);
      setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
      setShowNotifications(false);

      if (notif.type === 'ORDER_ASSIGNED') {
        navigate(`/livreur/dashboard`);
      } else if (notif.type === 'ACCOUNT_CREATED') {
        navigate(`/livreur/profile`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'ORDER_ASSIGNED':
      case 'ORDER_STATUS_UPDATE':
        return <Truck size={18} className="text-blue-600" />;
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
    return then.toLocaleDateString();
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté');
  };

  const navItems = [
    { path: '/livreur/dashboard', icon: Home, label: 'Dashboard', color: 'text-blue-600' },
    { path: '/livreur/deliveries', icon: Truck, label: 'Livraisons', color: 'text-blue-500' },
    { path: '/livreur/history', icon: History, label: 'Historique', color: 'text-blue-400' },
    { path: '/livreur/profile', icon: User, label: 'Profil', color: 'text-blue-600' },
  ];

  return (
    <>
      <div className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link to="/livreur/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
              <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/30 group-hover:bg-white/30 transition-all">
                <Truck size={28} className="font-black" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-black text-white">Livreur PRO</p>
                <p className="text-xs text-blue-100 font-medium">Gestion</p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${isActive(item.path)
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/20'
                    }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-xl text-white relative transition-all border border-white/30"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-blue-600">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-gray-900 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                      <span className="font-bold">Notifications</span>
                      <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                          <Bell size={24} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Aucune notification</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-4 border-b border-gray-50 hover:bg-blue-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                          >
                            <div className="flex gap-3">
                              <div className="flex-shrink-0 mt-1">{getNotificationIcon(notif.type)}</div>
                              <div className="flex-1">
                                <p className={`text-xs font-semibold ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{notif.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{getTimeLabel(notif.createdAt)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Rating */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-white/20 backdrop-blur rounded-xl border border-white/30">
                <Star size={16} className="fill-yellow-300 text-yellow-300" />
                <span className="text-sm font-bold text-white">{user?.rating || 5}.0</span>
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl transition-all"
              >
                <LogOut size={18} />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/20 rounded-xl transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-b from-blue-600 to-blue-700 shadow-xl animate-in fade-in slide-in-from-top-2">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(item.path) ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                  }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-white/20 space-y-3">
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 rounded-xl transition-all border border-white/30"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </nav>
        </div>
      )}

      {!user?.isVerified && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle size={24} className="text-white" />
            <div>
              <p className="text-sm font-bold text-white">Profil en attente de vérification</p>
              <p className="text-xs text-orange-100">Un administrateur examinera votre demande bientôt.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LivreurHeader;
