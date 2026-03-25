/**
 * webhooks.routes.ts
 * Inbound webhook receiver from the self-hosted n8n instance.
 *
 * ⚠️  These routes are intentionally placed BEFORE the global
 *     `authenticate` middleware in index.ts because n8n cannot
 *     pass a Clerk session token. Security is enforced instead
 *     via a shared secret in the X-N8N-WEBHOOK-SECRET header.
 *
 * POST /api/webhooks/n8n/execution-complete
 *   Called by n8n when a workflow execution finishes.
 *   Verifies the shared secret, then emits a `run.completed`
 *   Socket.io event so the frontend updates in real-time.
 */
import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { verifyWebhookSecret } from '../services/n8n.service';
import { io } from '../index';

export const webhooksRouter = Router();

// ─────────────────────────────────────────────────────────────
// POST /api/webhooks/n8n/execution-complete
//
// Expected payload from n8n (configure via HTTP Request node
// or n8n's built-in "On Workflow Complete" trigger):
// {
//   executionId:  string,
//   workflowId:   string,   ← n8n-native workflow ID
//   status:       'success' | 'error',
//   startedAt:    string,   ← ISO 8601
//   stoppedAt:    string,   ← ISO 8601
//   mode:         string,
//   retryOf:      string | null
// }
// ─────────────────────────────────────────────────────────────
webhooksRouter.post('/n8n/execution-complete', async (req: Request, res: Response) => {
    // ── 1. Authenticate the incoming request ──────────────────
    const incomingSecret = req.headers['x-n8n-webhook-secret'] as string | undefined;

    if (!verifyWebhookSecret(incomingSecret)) {
        console.warn('[webhook] Rejected request with invalid webhook secret');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // ── 2. Parse and validate payload ────────────────────────
    const {
        executionId,
        workflowId,   // n8n-native ID
        status,
        startedAt,
        stoppedAt,
        mode,
        retryOf = null,
    } = req.body as {
        executionId: string;
        workflowId: string;
        status: 'success' | 'error' | string;
        startedAt: string;
        stoppedAt: string;
        mode: string;
        retryOf?: string | null;
    };

    if (!executionId || !workflowId || !status) {
        return res.status(400).json({ error: 'executionId, workflowId, and status are required.' });
    }

    // ── 3. Resolve local IbaWorkflow so we can enrich the event ─
    //    This is a read-only join — no execution data is stored.
    const localWorkflow = await prisma.ibaWorkflow.findFirst({
        where: { n8n_workflow_id: workflowId },
        select: {
            id: true,
            name: true,
            department: true,
            client_id: true,
            time_saving_multiplier: true,
            status: true,
        },
    });

    // ── 4. Build the Socket.io event payload ──────────────────
    const durationMs =
        startedAt && stoppedAt
            ? new Date(stoppedAt).getTime() - new Date(startedAt).getTime()
            : null;

    const eventPayload = {
        executionId,
        n8nWorkflowId: workflowId,
        status,
        mode,
        startedAt,
        stoppedAt,
        durationMs,
        retryOf,
        // Local metadata (null if workflow not registered in IBA)
        workflowId: localWorkflow?.id ?? null,
        workflowName: localWorkflow?.name ?? workflowId,
        department: localWorkflow?.department ?? null,
        clientId: localWorkflow?.client_id ?? null,
        minutesSaved:
            status === 'success' && localWorkflow?.time_saving_multiplier
                ? localWorkflow.time_saving_multiplier
                : 0,
    };

    // ── 5. Emit real-time event ───────────────────────────────
    //
    //  • Global broadcast  : 'run.completed'
    //    Received by every connected frontend client.
    //
    //  • Client-scoped room: `client:${clientId}`
    //    If the workflow belongs to a registered client, we also
    //    emit to a per-client room so other clients don't receive
    //    each other's events. The frontend should join its own room
    //    at socket connect time:  socket.emit('join', userId)
    //
    io.emit('run.completed', eventPayload);

    if (localWorkflow?.client_id) {
        io.to(`client:${localWorkflow.client_id}`).emit('run.completed', eventPayload);
    }

    console.log(
        `[webhook] run.completed emitted — execId=${executionId} wfId=${workflowId} status=${status}`,
    );

    // ── 6. Respond 200 immediately so n8n doesn't retry ──────
    return res.status(200).json({ received: true });
});
