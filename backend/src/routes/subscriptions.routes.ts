import { Router } from 'express';
export const subscriptionsRouter = Router();

// GET /api/v1/subscriptions/me — Get current user's subscription
subscriptionsRouter.get('/me', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/subscriptions/upgrade — Upgrade plan (Stripe checkout)
subscriptionsRouter.post('/upgrade', async (_req, res) => {
    // TODO: Create Stripe checkout session, return URL
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/subscriptions/cancel — Schedule cancellation at period end
subscriptionsRouter.post('/cancel', async (_req, res) => {
    // TODO: Set cancels_at_period_end = true via Stripe API
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/subscriptions/webhook — Stripe webhook handler (no auth)
subscriptionsRouter.post('/webhook', async (_req, res) => {
    // TODO: Verify Stripe signature, handle events: invoice.paid, subscription.updated, etc.
    res.status(501).json({ message: 'Not implemented yet' });
});
