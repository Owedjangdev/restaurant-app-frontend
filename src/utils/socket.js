import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
});

export const connectSocket = (userId, role) => {
    if (!socket.connected) {
        socket.connect();
        socket.on('connect', () => {
            console.log('🔌 Connected to socket server');
            socket.emit('join', { userId, role });
        });
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
        console.log('🔌 Disconnected from socket server');
    }
};

export default socket;
