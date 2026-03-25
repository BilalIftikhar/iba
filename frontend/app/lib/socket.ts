'use client';

// Singleton Socket.io-client instance shared across the app.
// Import `getSocket()` anywhere on the client side.

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000', {
            transports: ['websocket', 'polling'],
            autoConnect: true,
            // Reconnect with exponential back-off (socket.io default)
        });

        socket.on('connect', () => {
            console.log('[Socket.io] Connected:', socket!.id);
            // Join the per-user room so we receive scoped run.completed events.
            // Replace with real userId from your auth provider (e.g. Clerk).
            const userId = (typeof window !== 'undefined' && (window as { __CLERK_USER_ID?: string }).__CLERK_USER_ID) ?? 'anonymous';
            socket!.emit('join', userId);
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket.io] Disconnected:', reason);
        });

        socket.on('connect_error', (err) => {
            console.warn('[Socket.io] Connection error:', err.message);
        });
    }

    return socket;
}
