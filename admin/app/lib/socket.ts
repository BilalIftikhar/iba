'use client';

// Singleton Socket.io-client instance for the Admin Dashboard.
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000', {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('[Admin-Socket] Connected:', socket!.id);
            // Admins can join a specialized "admin" room to receive all system-wide alerts
            socket!.emit('join', 'admin-inbox');
        });

        socket.on('disconnect', (reason) => {
            console.log('[Admin-Socket] Disconnected:', reason);
        });

        socket.on('connect_error', (err) => {
            console.warn('[Admin-Socket] Connection error:', err.message);
        });
    }

    return socket;
}
