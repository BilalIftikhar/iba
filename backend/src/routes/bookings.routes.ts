import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const bookingsRouter = Router();

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
    return res.status(501).json({ message: 'Not implemented yet' });
});

// PATCH /api/v1/bookings/:id — Update booking (save draft state, etc.)
bookingsRouter.patch('/:id', async (req: Request, res: Response) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});

// DELETE /api/v1/bookings/:id — Cancel a booking
bookingsRouter.delete('/:id', async (req: Request, res: Response) => {
    return res.status(501).json({ message: 'Not implemented yet' });
});
