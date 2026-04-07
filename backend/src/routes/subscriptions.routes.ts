import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';
export const subscriptionsRouter = Router();

// GET /api/v1/subscriptions/me — Get current user's subscription
subscriptionsRouter.get('/me', authenticate, async (req, res) => {
    try {
        if (!req.auth?.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        let sub = await prisma.subscription.findUnique({
            where: { client_id: req.auth.userId }
        });
        if (!sub) {
            // Lazy creation of a free tier if not found
            sub = await prisma.subscription.create({
                data: {
                    client_id: req.auth.userId,
                    plan: 'free',
                    status: 'active',
                    automations_limit: 10
                }
            });
        }
        return res.status(200).json({ 
            success: true, 
            data: {
                ...sub,
                usage: {
                    api_calls: 42000,
                    storage: 47,
                    team_seats_used: 1 // hardcoded for now
                }
            } 
        });
    } catch (err: any) {
        console.error('[GET /subscriptions/me]', err);
        return res.status(500).json({ error: 'Failed to fetch subscription' });
    }
});

// POST /api/v1/subscriptions/upgrade — Upgrade plan (Stripe checkout)
subscriptionsRouter.post('/upgrade', authenticate, async (_req, res) => {
    // TODO: Create Stripe checkout session, return URL
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/subscriptions/cancel — Schedule cancellation at period end
subscriptionsRouter.post('/cancel', authenticate, async (_req, res) => {
    // TODO: Set cancels_at_period_end = true via Stripe API
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/subscriptions/webhook — Stripe webhook handler (no auth)
subscriptionsRouter.post('/webhook', async (_req, res) => {
    // TODO: Verify Stripe signature, handle events
    res.status(501).json({ message: 'Not implemented yet' });
});
