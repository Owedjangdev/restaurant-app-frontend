import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authService } from '../services/authService';

export const useAuth = () => {
    const { user, isAuthenticated, login, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            login(data.user, data.token);

            // Redirect according to role
            const roleRoutes = {
                admin: '/admin/dashboard',
                client: '/client/dashboard',
                livreur: '/livreur/dashboard',
            };

            navigate(roleRoutes[data.user.role]);
        } catch (error) {
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout failed', error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    return {
        user,
        isAuthenticated,
        login: handleLogin,
        logout: handleLogout
    };
};
