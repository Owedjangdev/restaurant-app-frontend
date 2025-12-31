// Mock Authentication Service for Demo/Development
// This allows testing the app without a real backend

const DEMO_USERS = [
    {
        id: '1',
        email: 'admin@demo.com',
        password: 'admin123',
        role: 'admin',
        name: 'Admin Demo',
        phone: '+229 97 00 00 01'
    },
    {
        id: '2',
        email: 'client@demo.com',
        password: 'client123',
        role: 'client',
        name: 'Client Demo',
        phone: '+229 97 00 00 02'
    },
    {
        id: '3',
        email: 'livreur@demo.com',
        password: 'livreur123',
        role: 'livreur',
        name: 'Livreur Demo',
        phone: '+229 97 00 00 03',
        isAvailable: true
    }
];

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthService = {
    login: async (credentials) => {
        await delay();

        const user = DEMO_USERS.find(
            u => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
            throw new Error('Identifiants invalides');
        }

        // Return user without password
        const { password, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token: `demo-token-${user.id}-${Date.now()}`
        };
    },

    register: async (userData) => {
        await delay();

        // Check if email already exists
        const existingUser = DEMO_USERS.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('Cet email est déjà utilisé');
        }

        // Create new user
        const newUser = {
            id: String(DEMO_USERS.length + 1),
            email: userData.email,
            name: userData.name,
            phone: userData.phone,
            role: 'client', // New registrations are always clients
            password: userData.password
        };

        DEMO_USERS.push(newUser);

        const { password, ...userWithoutPassword } = newUser;

        return {
            user: userWithoutPassword,
            token: `demo-token-${newUser.id}-${Date.now()}`
        };
    },

    logout: async () => {
        await delay(200);
        // Nothing to do in mock
    },

    getCurrentUser: async () => {
        await delay();
        // In a real app, this would validate the token
        // For demo, we'll just return the first user
        const { password, ...userWithoutPassword } = DEMO_USERS[0];
        return userWithoutPassword;
    },
};

// Export demo credentials for easy reference
export const DEMO_CREDENTIALS = {
    admin: { email: 'admin@demo.com', password: 'admin123' },
    client: { email: 'client@demo.com', password: 'client123' },
    livreur: { email: 'livreur@demo.com', password: 'livreur123' }
};
