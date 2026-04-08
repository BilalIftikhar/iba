import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// List of admin user IDs or emails — you can move these to env/DB later
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'admin@iba.si').split(',').map(e => e.trim().toLowerCase());

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.auth?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        // ── Development Mode Bypass ──
        // If we are in local development and the user hasn't specified admin emails yet,
        // we allow access so they can set up the system.
        if (process.env.NODE_ENV !== 'production' && !process.env.ADMIN_EMAILS) {
            return next();
        }

        if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
            console.warn(`[requireAdmin] Access denied for user: ${user?.email || 'Unknown'}`);
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        next();
    } catch (err) {
        console.error('[requireAdmin]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
