import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const bookingsRouter = Router();

// GET /api/v1/bookings/templates — Fetch public automation templates
bookingsRouter.get('/templates', async (_req: Request, res: Response) => {
    try {
        const templates = await prisma.cmsAutomationTemplate.findMany({
            where: { is_published: true },
            orderBy: { display_order: 'asc' }
        });
        return res.status(200).json({ success: true, data: templates });
    } catch (error: any) {
        console.error('[GET /bookings/templates]', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch templates.' });
    }
});

// GET /api/v1/bookings/app-templates — Fetch public app templates for frontend
bookingsRouter.get('/app-templates', async (_req: Request, res: Response) => {
    try {
        const templates = await prisma.cmsAppTemplate.findMany({
            where: { is_published: true },
            orderBy: { display_order: 'asc' }
        });
        return res.status(200).json({ success: true, data: templates });
    } catch (error: any) {
        console.error('[GET /bookings/app-templates]', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch app templates.' });
    }
});

// GET /api/v1/bookings/ai-examples — Fetch public AI examples for frontend
bookingsRouter.get('/ai-examples', async (_req: Request, res: Response) => {
    try {
        const examples = await prisma.cmsAiExample.findMany({
            where: { is_published: true },
            orderBy: { display_order: 'asc' }
        });
        return res.status(200).json({ success: true, data: examples });
    } catch (error: any) {
        console.error('[GET /bookings/ai-examples]', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch AI examples.' });
    }
});

// GET /api/v1/bookings — List all bookings for authenticated user
bookingsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const bookings = await prisma.booking.findMany({
            where: { client_id: userId },
            orderBy: { id: 'desc' }
        });
        return res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
        console.error('[GET /bookings]', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch bookings.' });
    }
});

// POST /api/v1/bookings — Create a new booking (starts as draft)
bookingsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const {
            type = 'automation',
            status = 'draft',
            title,
            use_case,
            problem,
            outcome,
            tools_list,
            schedule_frequency,
            notifications,
            draft_state
        } = req.body;

        // Generate BOOK-XXXX ID
        const lastBooking = await prisma.booking.findFirst({
            orderBy: { id: 'desc' },
            where: { id: { startsWith: 'BOOK-' } }
        });
        
        let nextNumber = 1;
        if (lastBooking) {
            const num = parseInt(lastBooking.id.replace('BOOK-', ''), 10);
            if (!isNaN(num)) nextNumber = num + 1;
        }
        const newId = `BOOK-${nextNumber.toString().padStart(4, '0')}`;

        const booking = await prisma.booking.create({
            data: {
                id: newId,
                client_id: userId,
                type,
                status,
                title: title || use_case?.substring(0, 50) || 'New Automation',
                use_case: use_case || '',
                problem,
                outcome,
                tools_list,
                schedule_frequency,
                notifications,
                draft_state,
                booked_at: status === 'booked' ? new Date() : null,
            }
        });

        return res.status(201).json({ success: true, data: booking });
    } catch (error: any) {
        console.error('[POST /bookings]', error);
        return res.status(500).json({ success: false, error: 'Failed to create booking.' });
    }
});

// GET /api/v1/bookings/:id — Get single booking by ID
bookingsRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const booking = await prisma.booking.findFirst({
            where: { id: req.params.id, client_id: userId }
        });
        if (!booking) return res.status(404).json({ success: false, error: 'Booking not found.' });
        return res.status(200).json({ success: true, data: booking });
    } catch (error: any) {
        console.error('[GET /bookings/:id]', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch booking.' });
    }
});

// PATCH /api/v1/bookings/:id — Update booking (save draft state, change status, etc.)
bookingsRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const existing = await prisma.booking.findFirst({
            where: { id: req.params.id, client_id: userId }
        });
        if (!existing) return res.status(404).json({ success: false, error: 'Booking not found.' });

        const {
            status, title, use_case, problem, outcome,
            tools_list, schedule_frequency, notifications, draft_state
        } = req.body;

        const updated = await prisma.booking.update({
            where: { id: req.params.id },
            data: {
                ...(status !== undefined && { status }),
                ...(title !== undefined && { title }),
                ...(use_case !== undefined && { use_case }),
                ...(problem !== undefined && { problem }),
                ...(outcome !== undefined && { outcome }),
                ...(tools_list !== undefined && { tools_list }),
                ...(schedule_frequency !== undefined && { schedule_frequency }),
                ...(notifications !== undefined && { notifications }),
                ...(draft_state !== undefined && { draft_state }),
                ...(status === 'booked' && !existing.booked_at && { booked_at: new Date() }),
            }
        });

        return res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
        console.error('[PATCH /bookings/:id]', error);
        return res.status(500).json({ success: false, error: 'Failed to update booking.' });
    }
});

// DELETE /api/v1/bookings/:id — Cancel a booking (soft delete via status)
bookingsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const existing = await prisma.booking.findFirst({
            where: { id: req.params.id, client_id: userId }
        });
        if (!existing) return res.status(404).json({ success: false, error: 'Booking not found.' });

        const cancelled = await prisma.booking.update({
            where: { id: req.params.id },
            data: { status: 'cancelled' }
        });

        return res.status(200).json({ success: true, data: cancelled });
    } catch (error: any) {
        console.error('[DELETE /bookings/:id]', error);
        return res.status(500).json({ success: false, error: 'Failed to cancel booking.' });
    }
});

