import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';
import AuthLayout from './components/layout/AuthLayout';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminDeliveries from './pages/admin/Deliveries';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';

// Client pages
import ClientDashboard from './pages/client/Dashboard';
import NewOrder from './pages/client/NewOrder';
import MyOrders from './pages/client/MyOrders';
import OrderDetail from './pages/client/OrderDetail';

// Livreur pages
import LivreurDashboard from './pages/livreur/Dashboard';
import Deliveries from './pages/livreur/Deliveries';
import DeliveryDetail from './pages/livreur/DeliveryDetail';
import LivreurHistory from './pages/livreur/History';
import LivreurProfile from './pages/livreur/Profile';

// Shared pages
import Support from './pages/Support';
import ClientProfile from './pages/client/Profile';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public / Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="deliveries" element={<AdminDeliveries />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Client routes */}
        <Route path="/client" element={
          <ProtectedRoute allowedRoles={['client']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="new-order" element={<NewOrder />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* Livreur routes */}
        <Route path="/livreur" element={
          <ProtectedRoute allowedRoles={['livreur']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<LivreurDashboard />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="deliveries/:id" element={<DeliveryDetail />} />
          <Route path="history" element={<LivreurHistory />} />
          <Route path="profile" element={<LivreurProfile />} />
        </Route>

        {/* Support route */}
        <Route path="/support" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Support />} />
        </Route>

        {/* Home redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Error pages */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="max-w-md w-full text-center bg-white p-12 rounded-3xl shadow-xl">
              <h1 className="text-6xl font-black text-red-100 mb-4">403</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
              <p className="text-gray-500 mb-8">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
              <button onClick={() => window.history.back()} className="text-blue-600 font-bold underline">Retourner en arrière</button>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
