import { Router } from 'express';
export const messagesRouter = Router();

// GET /api/v1/messages/threads — List all message threads for the user
messagesRouter.get('/threads', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/messages/threads — Create a new message thread
messagesRouter.post('/threads', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// GET /api/v1/messages/threads/:id — Get thread with its messages
messagesRouter.get('/threads/:id', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});

// POST /api/v1/messages/threads/:id/messages — Send a message in a thread
messagesRouter.post('/threads/:id/messages', async (_req, res) => {
    // TODO: Create message, update thread.last_message_at, emit socket event
    res.status(501).json({ message: 'Not implemented yet' });
});

// PATCH /api/v1/messages/threads/:id/close — Close a thread
messagesRouter.patch('/threads/:id/close', async (_req, res) => {
    res.status(501).json({ message: 'Not implemented yet' });
});
