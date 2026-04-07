import express from 'express';
import http from 'http';
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
import { subscriptionsRouter } from './routes/subscriptions.routes';
import { statsRouter } from './routes/stats.routes';
import { webhooksRouter } from './routes/webhooks.routes';
import { teamsRouter } from './routes/teams.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const server = http.createServer(app);

// ── Socket.io ────────────────────────────────────────────────
export const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
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
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use(`${API}/subscriptions`, subscriptionsRouter);
app.use(`${API}/stats`, statsRouter);
app.use(`${API}/teams`, teamsRouter);

// ── Error Handler (must be last) ─────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 4000;
server.listen(PORT, () => {
    console.log(`\n🚀 IBA Backend running on http://localhost:${PORT}`);
    console.log(`   API base: http://localhost:${PORT}${API}`);
});
