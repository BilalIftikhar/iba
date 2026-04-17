import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';

import { authRouter } from './routes/auth.routes';
import { bookingsRouter } from './routes/bookings.routes';
import { credentialsRouter } from './routes/credentials.routes';
import { workflowsRouter } from './routes/workflows.routes';
import { messagesRouter } from './routes/messages.routes';
import { notificationsRouter } from './routes/notifications.routes';
import { subscriptionsRouter } from './routes/subscriptions.routes';
import { statsRouter } from './routes/stats.routes';
import { webhooksRouter } from './routes/webhooks.routes';
import { teamsRouter } from './routes/teams.routes';
import { uploadRouter } from './routes/upload.routes';
import { adminRouter } from './routes/admin.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
    process.env.FRONTEND_URL ?? 'https://dashboard.iba.live',
    process.env.ADMIN_URL ?? 'https://admin.iba.live',
];

// ── Socket.io ────────────────────────────────────────────────
export const io = new SocketIOServer(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    /**
     * Clients emit 'join' with their userId immediately after connecting
     * so they receive scoped `run.completed` events for their own workflows.
     *   socket.emit('join', userId);
     */
    socket.on('join', (userId: string) => {
        if (typeof userId === 'string' && userId.length > 0) {
            socket.join(`client:${userId}`);
            console.log(`[Socket.io] ${socket.id} joined room client:${userId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
});

// ── Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

import { authenticate } from './middleware/auth.middleware';

// ── Unauthenticated Inbound Webhooks ─────────────────────────
// Registered BEFORE global authenticate — n8n cannot pass Clerk tokens.
// Security is handled inside the router via shared-secret verification.
app.use('/api/webhooks', webhooksRouter);

// ── Global Authentication ────────────────────────────────────
// Protects all Express API routes configured below this point
app.use(authenticate);

// ── API Routes ───────────────────────────────────────────────
const API = '/api/v1';
app.use(`${API}/auth`, authRouter);
app.use(`${API}/bookings`, bookingsRouter);
app.use(`${API}/credentials`, credentialsRouter);
app.use(`${API}/workflows`, workflowsRouter);
app.use(`${API}/messages`, messagesRouter);
app.use(`${API}/notifications`, notificationsRouter);
app.use(`${API}/subscriptions`, subscriptionsRouter);
app.use(`${API}/stats`, statsRouter);
app.use(`${API}/upload`, uploadRouter);
app.use(`${API}/teams`, teamsRouter);
app.use(`${API}/admin`, adminRouter);

// ── Error Handler (must be last) ─────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 4000;

// 2. Listen on '0.0.0.0' to allow external traffic
server.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 IBA Backend running on port ${PORT}`);
    console.log(`   Internal API base: http://0.0.0.0:${PORT}${API}`);
});
