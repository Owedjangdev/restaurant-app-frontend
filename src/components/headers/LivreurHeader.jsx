import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Truck,
  MapPin,
  Clock,
  LogOut,
  Menu,
  X,
  Home,
  History,
  User,
  Star,
  AlertCircle,
  Bell,
  CheckCircle,
  UserPlus
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
  const location = useLocation();
  const navigate = useNavigate();
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

  const getTimeLabel = (date) => {
    const diffInMin = Math.floor((new Date() - new Date(date)) / 60000);
    if (diffInMin < 1) return 'À l\'instant';
    if (diffInMin < 60) return `${diffInMin} min`;
    return new Date(date).toLocaleDateString();
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    toast.success('Déconnecté');
  };

  const navItems = [
    { path: '/livreur/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/livreur/deliveries', icon: Truck, label: 'Livraisons' },
    { path: '/livreur/history', icon: History, label: 'Historique' },
    { path: '/livreur/profile', icon: User, label: 'Profil' },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-md shadow-lg border-b border-gray-100/50' : 'bg-white border-b border-gray-100'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/livreur/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform duration-300">
                <Truck size={22} className="font-black" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xl font-bold text-gray-900 leading-none tracking-tight">Livreur<span className="text-blue-600">PRO</span></p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mt-1">Espace dédié</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center bg-gray-50/80 p-1.5 rounded-2xl border border-gray-100">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${isActive(item.path)
                      ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                    }`}
                >
                  <item.icon size={18} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* Status Badge (Verified) */}
              {user?.isVerified && (
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100">
                  <CheckCircle size={14} className="fill-green-500 text-white" />
                  <span className="text-xs font-bold uppercase tracking-wide">Vérifié</span>
                </div>
              )}

              <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <div className="relative">
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2">
                      <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <span className="font-bold text-gray-900">Notifications</span>
                        {notifications.length > 0 && (
                          <button onClick={() => { notificationService.deleteAll(); setNotifications([]) }} className="text-xs text-red-500 font-medium">Tout effacer</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-gray-400">
                            <Bell size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm font-medium">Aucune notification</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => handleNotificationClick(notif)}
                              className={`p-4 border-b border-gray-50 hover:bg-blue-50/50 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                            >
                              <div className="mt-0.5">
                                {notif.type === 'ORDER_ASSIGNED' ? <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full"><Truck size={14} /></div> :
                                  <div className="p-1.5 bg-gray-100 text-gray-600 rounded-full"><Bell size={14} /></div>}
                              </div>
                              <div>
                                <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{notif.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1 font-medium">{getTimeLabel(notif.createdAt)}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Logout (Desktop) */}
              <button
                onClick={handleLogout}
                className="hidden lg:flex items-center justify-center p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-2 z-30">
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${isActive(item.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-gray-100 my-2"></div>
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Verification Alert Banner */}
      {!user?.isVerified && (
        <div className="bg-orange-500 text-white px-4 py-2 shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-center sm:justify-start gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm font-medium text-center sm:text-left">
              Votre compte est en attente de vérification. Certaines fonctionnalités sont limitées.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default LivreurHeader;
