import { Router } from 'express';
import { prisma } from '../lib/prisma';

export const notificationsRouter = Router();

// GET /api/v1/notifications — Fetch all notifications for the authenticated user
notificationsRouter.get('/', async (req: any, res) => {
    try {
        const userId = req.auth?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const notifications = await prisma.notification.findMany({
            where: { client_id: userId },
            orderBy: { created_at: 'desc' },
            take: 50
        });

        return res.json({ success: true, data: notifications });
    } catch (err) {
        console.error('[GET /notifications]', err);
        return res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// GET /api/v1/notifications/unread-count
notificationsRouter.get('/unread-count', async (req: any, res) => {
    try {
        const userId = req.auth?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const count = await prisma.notification.count({
            where: { client_id: userId, read_at: null }
        });

        return res.json({ success: true, data: { count } });
    } catch (err) {
        return res.status(500).json({ error: 'Failed' });
    }
});

// PATCH /api/v1/notifications/read-all — Mark all as read
notificationsRouter.patch('/read-all', async (req: any, res) => {
    try {
        const userId = req.auth?.userId;
        await prisma.notification.updateMany({
            where: { client_id: userId, read_at: null },
            data: { read_at: new Date() }
        });
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Failed' });
    }
});

// PATCH /api/v1/notifications/:id/read — Mark single as read
notificationsRouter.patch('/:id/read', async (req: any, res) => {
    try {
        await prisma.notification.update({
            where: { id: req.params.id, client_id: req.auth?.userId },
            data: { read_at: new Date() }
        });
        return res.json({ success: true });
    } catch (err) {
        return res.status(500).json({ error: 'Failed' });
    }
});
