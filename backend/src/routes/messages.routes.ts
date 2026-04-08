import { Router } from 'express';
export const messagesRouter = Router();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/v1/messages/threads — List all message threads for the user
messagesRouter.get('/threads', async (req: any, res) => {
    try {
        const client_id = req.auth?.userId;
        if (!client_id) return res.status(401).json({ error: 'Unauthorized' });

        const threads = await prisma.messageThread.findMany({
            where: { client_id },
            include: {
                messages: { orderBy: { sent_at: 'desc' }, take: 1 }
            },
            orderBy: { last_message_at: 'desc' }
        });
        
        return res.json({ success: true, data: threads });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch threads' });
    }
});

// POST /api/v1/messages/threads — Create a new message thread
messagesRouter.post('/threads', async (req: any, res) => {
    try {
        const client_id = req.auth?.userId;
        const { category = 'support', related_entity_id, message, attachment_url } = req.body;
        if (!client_id || (!message && !attachment_url)) return res.status(400).json({ error: 'Message or attachment required' });

        const thread = await prisma.messageThread.create({
            data: {
                client_id,
                category,
                related_entity_id,
                last_message_at: new Date(),
                messages: {
                    create: {
                        sender_id: client_id,
                        sender_type: 'client',
                        body: message || '',
                        attachment_url: req.body.attachment_url || null,
                        attachment_name: req.body.attachment_name || null,
                    }
                }
            },
            include: { messages: true }
        });

        return res.json({ success: true, data: thread });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed' });
    }
});

// GET /api/v1/messages/threads/:id — Get thread with its messages
messagesRouter.get('/threads/:id', async (req: any, res) => {
    try {
        const client_id = req.auth?.userId;
        const { id } = req.params;
        
        const thread = await prisma.messageThread.findFirst({
            where: { id, client_id },
            include: { messages: { orderBy: { sent_at: 'asc' } } }
        });

        if (!thread) return res.status(404).json({ error: 'Not found' });

        // Mark admin messages as read
        await prisma.message.updateMany({
            where: { thread_id: id, sender_type: 'admin', read_at: null },
            data: { read_at: new Date() }
        });

        return res.json({ success: true, data: thread });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed' });
    }
});

// POST /api/v1/messages/threads/:id/messages — Send a message in a thread
messagesRouter.post('/threads/:id/messages', async (req: any, res) => {
    try {
        const client_id = req.auth?.userId;
        const { id } = req.params;
        const { body, attachment_url } = req.body;

        if (!body && !attachment_url) return res.status(400).json({ error: 'Body or attachment required' });

        const thread = await prisma.messageThread.findFirst({
            where: { id, client_id }
        });

        if (!thread) return res.status(404).json({ error: 'Thread not found' });

        const newMsg = await prisma.$transaction(async (tx) => {
            const msg = await tx.message.create({
                data: {
                    thread_id: id,
                    sender_id: client_id,
                    sender_type: 'client',
                    body: body || '',
                    attachment_url: req.body.attachment_url || null,
                    attachment_name: req.body.attachment_name || null,
                }
            });
            await tx.messageThread.update({
                where: { id },
                data: { last_message_at: new Date() }
            });
            return msg;
        });

        // ── Real-time Socket Event ──
        const { io } = require('../index');
        if (io) {
            io.emit('admin:new_message', { 
                thread_id: id, 
                message: newMsg,
                client_id: client_id
            });
        }

        return res.json({ success: true, data: newMsg });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed' });
    }
});

// PATCH /api/v1/messages/threads/:id/close — Close a thread
messagesRouter.patch('/threads/:id/close', async (req: any, res) => {
    try {
        const thread = await prisma.messageThread.update({
            where: { id: req.params.id, client_id: req.auth?.userId },
            data: { status: 'closed' }
        });
        return res.json({ success: true, data: thread });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed' });
    }
});
