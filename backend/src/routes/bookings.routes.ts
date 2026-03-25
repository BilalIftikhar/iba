import { Router } from 'express';
export const bookingsRouter = Router();

// GET /api/v1/bookings — List all bookings for authenticated user
bookingsRouter.get('/', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/bookings — Create a new booking (starts as draft)
bookingsRouter.post('/', async (_req, res) => {
    // TODO: Generate BOOK-XXXX ID, validate body, create booking
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /api/v1/bookings/:id — Get single booking by ID
bookingsRouter.get('/:id', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// PATCH /api/v1/bookings/:id — Update booking (save draft state, etc.)
bookingsRouter.patch('/:id', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// DELETE /api/v1/bookings/:id — Cancel a booking
bookingsRouter.delete('/:id', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
