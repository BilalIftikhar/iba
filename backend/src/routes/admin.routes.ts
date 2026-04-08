import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAdmin } from '../middleware/admin.middleware';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const adminRouter = Router();

// All admin routes require admin role
adminRouter.use(requireAdmin);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback_refresh_secret_key';

// ── ADMIN AUTH ────────────────────────────────────────────────────
// POST /api/v1/admin/login  (public — no JWT required yet)
// We remove requireAdmin from this specific route by registering it before the use(requireAdmin)
// Actually login is separate — handled in adminAuthRouter below

// ── DASHBOARD STATS ───────────────────────────────────────────────
// GET /api/v1/admin/stats
adminRouter.get('/stats', async (_req: Request, res: Response) => {
    try {
        const [
            totalCustomers,
            activeBookings,
            unreadMessages,
            activeWorkflows,
            newBookingsThisMonth,
            newCustomersThisMonth,
            bookingsByStatus,
            recentBookings,
            recentSignups,
        ] = await Promise.all([
            // Total customers
            prisma.user.count({ where: { deleted_at: null } }),

            // Active bookings (in_review + in_progress)
            prisma.booking.count({ where: { status: { in: ['in_review', 'in_progress'] } } }),

            // Unread messages sent by clients (admin hasn't read)
            prisma.message.count({ where: { sender_type: 'client', read_at: null } }),

            // Active workflows (for MRR proxy)
            prisma.ibaWorkflow.count({ where: { status: 'active' } }),

            // New bookings this month
            prisma.booking.count({
                where: {
                    booked_at: { gte: new Date(new Date().setDate(1)) }
                }
            }),

            // New customers this month
            prisma.user.count({
                where: {
                    created_at: { gte: new Date(new Date().setDate(1)) },
                    deleted_at: null
                }
            }),

            // Bookings grouped by status
            prisma.booking.groupBy({ by: ['status'], _count: { id: true } }),

            // Recent bookings (action required) - submitted status
            prisma.booking.findMany({
                where: { status: { in: ['booked', 'in_review'] } },
                orderBy: { booked_at: 'desc' },
                take: 10,
                include: { client: { select: { first_name: true, last_name: true, email: true } } }
            }),

            // Recent signups
            prisma.user.findMany({
                where: { deleted_at: null },
                orderBy: { created_at: 'desc' },
                take: 10,
                include: { subscription: true, bookings: { select: { id: true } } }
            }),
        ]);

        // Compute rough MRR: assume $149 per active automation Pro subscription
        const proSubs = await prisma.subscription.count({ where: { plan: 'pro', status: 'active' } });
        const entSubs = await prisma.subscription.count({ where: { plan: 'enterprise', status: 'active' } });
        const mrr = proSubs * 149 + entSubs * 499;

        return res.json({
            success: true,
            data: {
                totalCustomers,
                activeBookings,
                unreadMessages,
                activeWorkflows,
                mrr,
                newBookingsThisMonth,
                newCustomersThisMonth,
                bookingsByStatus,
                recentBookings,
                recentSignups,
            }
        });
    } catch (err) {
        console.error('[GET /admin/stats]', err);
        return res.status(500).json({ error: 'Failed to fetch admin stats' });
    }
});

// ── BOOKINGS MANAGEMENT ───────────────────────────────────────────

// GET /api/v1/admin/bookings
adminRouter.get('/bookings', async (req: Request, res: Response) => {
    try {
        const { status, type, search, page = '1', limit = '20' } = req.query as Record<string, string>;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where: any = {};
        if (status) where.status = status;
        if (type) where.type = type;
        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
                { client: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { booked_at: 'desc' },
                include: {
                    client: { select: { id: true, first_name: true, last_name: true, email: true, company_name: true } }
                }
            }),
            prisma.booking.count({ where })
        ]);

        return res.json({ success: true, data: bookings, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        console.error('[GET /admin/bookings]', err);
        return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// POST /api/v1/admin/bookings
adminRouter.post('/bookings', async (req: Request, res: Response) => {
    try {
        const {
            client_id,
            id: booking_id_override,
            type,
            title,
            use_case,
            status,
            notify_customer,
            notify_message,
        } = req.body;

        if (!client_id || !type || !title) {
            return res.status(400).json({ error: 'client_id, type, and title are required' });
        }

        let newId = booking_id_override;
        if (!newId) {
            const lastBooking = await prisma.booking.findFirst({
                orderBy: { id: 'desc' },
                where: { id: { startsWith: 'BOOK-' } }
            });
            let nextNumber = 1;
            if (lastBooking) {
                const num = parseInt(lastBooking.id.replace('BOOK-', ''), 10);
                if (!isNaN(num)) nextNumber = num + 1;
            }
            newId = `BOOK-${nextNumber.toString().padStart(4, '0')}`;
        }

        const newBooking = await prisma.booking.create({
            data: {
                id: newId,
                client_id,
                type,
                title,
                use_case,
                status: status || 'submitted',
                booked_at: new Date(),
            }
        });

        if (notify_customer && notify_message) {
            await prisma.notification.create({
                data: {
                    client_id,
                    type: 'system',
                    title: `New Booking: ${title}`,
                    body: notify_message,
                    booking_id: newId,
                }
            });
        }

        return res.status(201).json({ success: true, data: newBooking });
    } catch (err) {
        console.error('[POST /admin/bookings]', err);
        return res.status(500).json({ error: 'Failed to create booking' });
    }
});

// GET /api/v1/admin/bookings/:id
adminRouter.get('/bookings/:id', async (req: Request, res: Response) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: req.params.id },
            include: {
                client: { select: { id: true, first_name: true, last_name: true, email: true, company_name: true, phone: true } },
                workflow: true,
            }
        });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        return res.json({ success: true, data: booking });
    } catch (err) {
        console.error('[GET /admin/bookings/:id]', err);
        return res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// PATCH /api/v1/admin/bookings/:id — Admin updates booking (status, timeline, etc.)
adminRouter.patch('/bookings/:id', async (req: Request, res: Response) => {
    try {
        const {
            status, title, timeline_setup_days, deployment_date,
        } = req.body;

        const existing = await prisma.booking.findUnique({ where: { id: req.params.id } });
        if (!existing) return res.status(404).json({ error: 'Booking not found' });

        const updated = await prisma.booking.update({
            where: { id: req.params.id },
            data: {
                ...(status !== undefined && { status }),
                ...(title !== undefined && { title }),
                ...(timeline_setup_days !== undefined && { timeline_setup_days }),
                ...(deployment_date !== undefined && { deployment_date: new Date(deployment_date) }),
                ...(status === 'deployed' && !existing.deployed_at && { deployed_at: new Date() }),
                ...(status === 'in_review' && !existing.booked_at && { booked_at: new Date() }),
            },
            include: { client: { select: { id: true, first_name: true, last_name: true, email: true } } }
        });

        return res.json({ success: true, data: updated });
    } catch (err) {
        console.error('[PATCH /admin/bookings/:id]', err);
        return res.status(500).json({ error: 'Failed to update booking' });
    }
});

// ── CUSTOMERS MANAGEMENT ─────────────────────────────────────────

// GET /api/v1/admin/customers
adminRouter.get('/customers', async (req: Request, res: Response) => {
    try {
        const { search, plan, page = '1', limit = '20' } = req.query as Record<string, string>;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where: any = { deleted_at: null };
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { first_name: { contains: search, mode: 'insensitive' } },
                { last_name: { contains: search, mode: 'insensitive' } },
                { company_name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [customers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { created_at: 'desc' },
                include: {
                    subscription: true,
                    bookings: { select: { id: true, status: true } },
                    workflows: { where: { status: 'active' }, select: { id: true } },
                }
            }),
            prisma.user.count({ where })
        ]);

        // Filter by plan if provided
        let filtered = customers;
        if (plan) {
            filtered = customers.filter(c => c.subscription?.plan === plan);
        }

        return res.json({ success: true, data: filtered, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        console.error('[GET /admin/customers]', err);
        return res.status(500).json({ error: 'Failed to fetch customers' });
    }
});

// GET /api/v1/admin/customers/:id
adminRouter.get('/customers/:id', async (req: Request, res: Response) => {
    try {
        const customer = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: {
                subscription: true,
                bookings: { orderBy: { booked_at: 'desc' }, take: 20 },
                workflows: { orderBy: { created_at: 'desc' }, take: 20 },
                message_threads: {
                    orderBy: { last_message_at: 'desc' },
                    take: 5,
                    include: { messages: { take: 1, orderBy: { sent_at: 'desc' } } }
                },
            }
        });
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        return res.json({ success: true, data: customer });
    } catch (err) {
        console.error('[GET /admin/customers/:id]', err);
        return res.status(500).json({ error: 'Failed to fetch customer' });
    }
});

// PATCH /api/v1/admin/customers/:id
adminRouter.patch('/customers/:id', async (req: Request, res: Response) => {
    try {
        const { account_manager_id } = req.body;
        const updated = await prisma.user.update({
            where: { id: req.params.id },
            data: { ...(account_manager_id !== undefined && { account_manager_id }) },
            select: { id: true, email: true, first_name: true, last_name: true, account_manager_id: true }
        });
        return res.json({ success: true, data: updated });
    } catch (err) {
        console.error('[PATCH /admin/customers/:id]', err);
        return res.status(500).json({ error: 'Failed to update customer' });
    }
});

// ── MESSAGES ──────────────────────────────────────────────────────

// GET /api/v1/admin/messages — All message threads with unread counts
adminRouter.get('/messages', async (req: Request, res: Response) => {
    try {
        const threads = await prisma.messageThread.findMany({
            orderBy: { last_message_at: 'desc' },
            take: 50,
            include: {
                client: { select: { id: true, first_name: true, last_name: true, email: true } },
                messages: {
                    orderBy: { sent_at: 'desc' },
                    take: 1,
                }
            }
        });

        // Count unread messages per thread (from client, not read)
        const threadsWithUnread = await Promise.all(threads.map(async (t) => {
            const unreadCount = await prisma.message.count({
                where: { thread_id: t.id, sender_type: 'client', read_at: null }
            });
            return { ...t, unreadCount };
        }));

        return res.json({ success: true, data: threadsWithUnread });
    } catch (err) {
        console.error('[GET /admin/messages]', err);
        return res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// GET /api/v1/admin/messages/:threadId
adminRouter.get('/messages/:threadId', async (req: Request, res: Response) => {
    try {
        const thread = await prisma.messageThread.findUnique({
            where: { id: req.params.threadId },
            include: {
                client: { select: { id: true, first_name: true, last_name: true, email: true } },
                messages: { orderBy: { sent_at: 'asc' } }
            }
        });
        if (!thread) return res.status(404).json({ error: 'Thread not found' });

        // Mark all client messages in this thread as read
        await prisma.message.updateMany({
            where: { thread_id: req.params.threadId, sender_type: 'client', read_at: null },
            data: { read_at: new Date() }
        });

        return res.json({ success: true, data: thread });
    } catch (err) {
        console.error('[GET /admin/messages/:threadId]', err);
        return res.status(500).json({ error: 'Failed to fetch thread' });
    }
});

// POST /api/v1/admin/messages/:threadId/reply — Admin sends a reply
adminRouter.post('/messages/:threadId/reply', async (req: Request, res: Response) => {
    try {
        const { body, attachment_url, attachment_name } = req.body;
        const adminId = req.auth.userId;

        if (!body?.trim() && !attachment_url) return res.status(400).json({ error: 'Message body or attachment is required' });

        const thread = await prisma.messageThread.findUnique({ where: { id: req.params.threadId } });
        if (!thread) return res.status(404).json({ error: 'Thread not found' });

        const message = await prisma.message.create({
            data: {
                thread_id: req.params.threadId,
                sender_id: adminId,
                sender_type: 'admin',
                body: body?.trim() || '',
                attachment_url: attachment_url || null,
                attachment_name: attachment_name || null,
            }
        });

        // Update thread last_message_at
        await prisma.messageThread.update({
            where: { id: req.params.threadId },
            data: { last_message_at: new Date() }
        });

        // Get dynamic title based on booking
        let notificationTitle = 'New message from IBA';
        if (thread.category === 'booking' && thread.related_entity_id) {
            const booking = await prisma.booking.findUnique({ where: { id: thread.related_entity_id }, select: { title: true } });
            if (booking?.title) {
                notificationTitle = `New message: ${booking.title}`;
            }
        }

        // Create notification for client
        const notification = await prisma.notification.create({
            data: {
                client_id: thread.client_id,
                type: 'message',
                title: notificationTitle,
                body: body?.trim() ? body.trim().substring(0, 100) : 'Sent an attachment',
                booking_id: thread.related_entity_id ?? undefined,
            }
        });

        // ── Real-time Socket Events ──
        const { io } = require('../index');
        if (io) {
            // 1. Emit the message itself
            io.to(`client:${thread.client_id}`).emit('client:new_message', {
                thread_id: thread.id,
                message: message
            });

            // 2. Emit a notification event
            io.to(`client:${thread.client_id}`).emit('client:new_notification', {
                notification: notification
            });
        }

        return res.status(201).json({ success: true, data: message });
    } catch (err) {
        console.error('[POST /admin/messages/:threadId/reply]', err);
        return res.status(500).json({ error: 'Failed to send reply' });
    }
});

// POST /api/v1/admin/messages/new — Admin creates new thread to client
adminRouter.post('/messages/new', async (req: Request, res: Response) => {
    try {
        const { client_id, booking_id, body, category = 'booking', attachment_url, attachment_name } = req.body;
        const adminId = req.auth.userId;

        if (!client_id || (!body?.trim() && !attachment_url)) {
            return res.status(400).json({ error: 'client_id and (body or attachment) are required' });
        }

        const thread = await prisma.messageThread.create({
            data: {
                client_id,
                category,
                related_entity_id: booking_id ?? null,
                last_message_at: new Date(),
                messages: {
                    create: {
                        sender_id: adminId,
                        sender_type: 'admin',
                        body: body?.trim() || '',
                        attachment_url: attachment_url || null,
                        attachment_name: attachment_name || null,
                    }
                }
            },
            include: { messages: true }
        });

        // Dynamic title
        let notificationTitle = 'New message from IBA';
        if (category === 'booking' && booking_id) {
            const b = await prisma.booking.findUnique({ where: { id: booking_id }, select: { title: true } });
            if (b?.title) notificationTitle = `New message: ${b.title}`;
        }

        // Notify client
        const notif = await prisma.notification.create({
            data: {
                client_id,
                type: 'message',
                title: notificationTitle,
                body: body?.trim() ? body.trim().substring(0, 100) : 'Sent an attachment',
                booking_id: booking_id ?? undefined,
            }
        });

        const { io } = require('../index');
        if (io) {
            io.to(`client:${client_id}`).emit('client:new_notification', { notification: notif });
        }

        return res.status(201).json({ success: true, data: thread });
    } catch (err) {
        console.error('[POST /admin/messages/new]', err);
        return res.status(500).json({ error: 'Failed to create thread' });
    }
});

// ── SUBSCRIPTIONS MANAGEMENT ─────────────────────────────────────

// GET /api/v1/admin/subscriptions
adminRouter.get('/subscriptions', async (_req: Request, res: Response) => {
    try {
        const subs = await prisma.subscription.findMany({
            include: { client: { select: { id: true, first_name: true, last_name: true, email: true, company_name: true } } },
            orderBy: { client: { created_at: 'desc' } }
        });
        return res.json({ success: true, data: subs });
    } catch (err) {
        console.error('[GET /admin/subscriptions]', err);
        return res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
});

// PATCH /api/v1/admin/subscriptions/:id
adminRouter.patch('/subscriptions/:id', async (req: Request, res: Response) => {
    try {
        const { plan, status, billing_cycle, automations_limit } = req.body;
        const updated = await prisma.subscription.update({
            where: { id: req.params.id },
            data: {
                ...(plan !== undefined && { plan }),
                ...(status !== undefined && { status }),
                ...(billing_cycle !== undefined && { billing_cycle }),
                ...(automations_limit !== undefined && { automations_limit }),
            },
            include: { client: { select: { id: true, first_name: true, last_name: true, email: true } } }
        });
        return res.json({ success: true, data: updated });
    } catch (err) {
        console.error('[PATCH /admin/subscriptions/:id]', err);
        return res.status(500).json({ error: 'Failed to update subscription' });
    }
});

// ── CONTENT CMS ───────────────────────────────────────────────────

// GET /api/v1/admin/cms/automation-templates — fetch all automation use case suggestions
// These are stored as simple workflow "name" seeds — for now return static list
// In a real app these would be a CmsTemplate model
adminRouter.get('/cms/automation-templates', async (_req: Request, res: Response) => {
    // For now return the distinct use_case values from bookings as templates
    try {
        const useCases = await prisma.booking.findMany({
            select: { use_case: true, type: true, title: true },
            distinct: ['use_case'],
            where: { use_case: { not: '' } },
            take: 50,
        });
        return res.json({ success: true, data: useCases });
    } catch (err) {
        console.error('[GET /admin/cms/automation-templates]', err);
        return res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

adminRouter.get('/cms/app-templates', async (_req: Request, res: Response) => {
    try {
        const useCases = await prisma.booking.findMany({
            select: { use_case: true, type: true, title: true },
            distinct: ['use_case'],
            where: { use_case: { not: '' }, type: 'custom_app' },
            take: 50,
        });
        return res.json({ success: true, data: useCases });
    } catch (err) {
        console.error('[GET /admin/cms/app-templates]', err);
        return res.status(500).json({ error: 'Failed to fetch app templates' });
    }
});

adminRouter.get('/cms/implementation-templates', async (_req: Request, res: Response) => {
    try {
        const useCases = await prisma.booking.findMany({
            select: { use_case: true, type: true, title: true },
            distinct: ['use_case'],
            where: { use_case: { not: '' } },
            take: 50,
        });
        return res.json({ success: true, data: useCases });
    } catch (err) {
        console.error('[GET /admin/cms/implementation-templates]', err);
        return res.status(500).json({ error: 'Failed to fetch implementation templates' });
    }
});

// ── WORKFLOWS MANAGEMENT ─────────────────────────────────────────

// GET /api/v1/admin/workflows — All workflows across all clients
adminRouter.get('/workflows', async (req: Request, res: Response) => {
    try {
        const { status, search } = req.query as Record<string, string>;
        const where: any = {};
        if (status) where.status = status;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { n8n_workflow_id: { contains: search, mode: 'insensitive' } },
            ];
        }

        const workflows = await prisma.ibaWorkflow.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                client: { select: { id: true, first_name: true, last_name: true, email: true } }
            }
        });

        return res.json({ success: true, data: workflows });
    } catch (err) {
        console.error('[GET /admin/workflows]', err);
        return res.status(500).json({ error: 'Failed to fetch workflows' });
    }
});

// POST /api/v1/admin/workflows — Create/link a workflow for a client
adminRouter.post('/workflows', async (req: Request, res: Response) => {
    try {
        const { client_id, n8n_workflow_id, name, department, booking_id, time_saving_multiplier } = req.body;

        const workflow = await prisma.ibaWorkflow.create({
            data: {
                client_id,
                n8n_workflow_id,
                name,
                department,
                booking_id: booking_id ?? null,
                time_saving_multiplier: time_saving_multiplier ? parseInt(time_saving_multiplier) : null,
                status: 'active',
                deployed_at: new Date(),
            }
        });

        // If linked to booking, mark it deployed
        if (booking_id) {
            await prisma.booking.update({
                where: { id: booking_id },
                data: { status: 'deployed', deployed_at: new Date() }
            });
        }

        return res.status(201).json({ success: true, data: workflow });
    } catch (err) {
        console.error('[POST /admin/workflows]', err);
        return res.status(500).json({ error: 'Failed to create workflow' });
    }
});

// PATCH /api/v1/admin/workflows/:id
adminRouter.patch('/workflows/:id', async (req: Request, res: Response) => {
    try {
        const { status, department, time_saving_multiplier } = req.body;
        const updated = await prisma.ibaWorkflow.update({
            where: { id: req.params.id },
            data: {
                ...(status !== undefined && { status }),
                ...(department !== undefined && { department }),
                ...(time_saving_multiplier !== undefined && { time_saving_multiplier }),
            }
        });
        return res.json({ success: true, data: updated });
    } catch (err) {
        console.error('[PATCH /admin/workflows/:id]', err);
        return res.status(500).json({ error: 'Failed to update workflow' });
    }
});

// ── TEAM ACCESS ───────────────────────────────────────────────────

// GET /api/v1/admin/team
adminRouter.get('/team', async (_req: Request, res: Response) => {
    try {
        const admins = await prisma.user.findMany({
            where: { email: { in: (process.env.ADMIN_EMAILS ?? 'admin@iba.si').split(',').map(e => e.trim()) } },
            select: { id: true, email: true, first_name: true, last_name: true, created_at: true }
        });
        return res.json({ success: true, data: admins });
    } catch (err) {
        console.error('[GET /admin/team]', err);
        return res.status(500).json({ error: 'Failed to fetch team' });
    }
});
