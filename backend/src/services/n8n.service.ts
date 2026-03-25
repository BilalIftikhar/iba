/**
 * n8n.service.ts
 * Secure HTTP client for the self-hosted n8n REST API.
 *
 * Authentication: every request carries the N8N_API_KEY in the
 * X-N8N-API-KEY header (n8n's native API key scheme).
 *
 * No execution data is persisted locally — this is a pure proxy layer.
 */
import { timingSafeEqual } from 'crypto';

// ─────────────────────────────────────────────────────────────
// Config — validated eagerly so mis-configuration fails loudly
// ─────────────────────────────────────────────────────────────

const getConfig = () => {
    const baseUrl = process.env.N8N_BASE_URL;
    const apiKey = process.env.N8N_API_KEY;

    if (!baseUrl) throw new Error('N8N_BASE_URL is not set');
    if (!apiKey) throw new Error('N8N_API_KEY is not set');

    return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey };
};

// ─────────────────────────────────────────────────────────────
// n8n REST API response shapes
// ─────────────────────────────────────────────────────────────

export interface N8nExecution {
    id: string;
    finished: boolean;
    mode: string;
    retryOf: string | null;
    retrySuccessId: string | null;
    startedAt: string;
    stoppedAt: string | null;
    workflowId: string;
    status: 'success' | 'error' | 'waiting' | 'running' | 'unknown';
    /** Only present when execution detail is fetched individually */
    data?: Record<string, unknown>;
}

export interface N8nExecutionList {
    data: N8nExecution[];
    nextCursor: string | null;
}

export interface N8nWorkflow {
    id: string;
    name: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    tags: { id: string; name: string }[];
}

// ─────────────────────────────────────────────────────────────
// Core fetch wrapper
// ─────────────────────────────────────────────────────────────

const n8nFetch = async <T = unknown>(path: string, options?: RequestInit): Promise<T> => {
    const { baseUrl, apiKey } = getConfig();
    const url = `${baseUrl}/api/v1${path}`;

    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'X-N8N-API-KEY': apiKey,
            ...(options?.headers ?? {}),
        },
    });

    if (!res.ok) {
        const body = await res.text();
        throw new Error(`[n8n] ${res.status} ${res.statusText}: ${body}`);
    }

    return res.json() as Promise<T>;
};

// ─────────────────────────────────────────────────────────────
// Webhook secret verification
// ─────────────────────────────────────────────────────────────

/**
 * Verifies the shared secret that n8n sends in the X-N8N-WEBHOOK-SECRET
 * header when calling our /api/webhooks/n8n/execution-complete endpoint.
 *
 * Configure a matching secret in n8n's "Header Auth" credential and set
 * N8N_WEBHOOK_SECRET in this server's .env.
 */
export const verifyWebhookSecret = (incomingSecret: string | undefined): boolean => {
    const expected = process.env.N8N_WEBHOOK_SECRET;
    if (!expected) {
        console.warn('[n8n] N8N_WEBHOOK_SECRET is not set — webhook auth is disabled');
        return true; // Permissive in dev; tighten in production
    }
    if (!incomingSecret) return false;

    // Constant-time comparison to prevent timing oracle attacks
    const a = Buffer.from(incomingSecret);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;

    return timingSafeEqual(a, b);
};

// ─────────────────────────────────────────────────────────────
// Public service API
// ─────────────────────────────────────────────────────────────

export const n8nService = {
    // ── Workflow management ───────────────────────────────────

    /** Get workflow details from n8n */
    getWorkflow: (n8nWorkflowId: string) =>
        n8nFetch<N8nWorkflow>(`/workflows/${n8nWorkflowId}`),

    /** Activate (resume) a workflow in n8n */
    activateWorkflow: (n8nWorkflowId: string) =>
        n8nFetch<N8nWorkflow>(`/workflows/${n8nWorkflowId}/activate`, { method: 'POST' }),

    /** Deactivate (pause) a workflow in n8n */
    deactivateWorkflow: (n8nWorkflowId: string) =>
        n8nFetch<N8nWorkflow>(`/workflows/${n8nWorkflowId}/deactivate`, { method: 'POST' }),

    // ── Execution history (live proxy — never stored in Postgres) ─

    /**
     * Fetches paginated executions for a specific workflow.
     * @param n8nWorkflowId  The n8n-native workflow ID
     * @param limit          Page size (max 250 per n8n API)
     * @param cursor         Pagination cursor from a previous response
     */
    getExecutions: (n8nWorkflowId: string, limit = 20, cursor?: string) => {
        const params = new URLSearchParams({
            workflowId: n8nWorkflowId,
            limit: String(limit),
        });
        if (cursor) params.set('cursor', cursor);
        return n8nFetch<N8nExecutionList>(`/executions?${params.toString()}`);
    },

    /**
     * Fetches paginated executions across ALL workflows (used for stats summary).
     * Optionally filtered by status.
     */
    getAllExecutions: (opts: {
        limit?: number;
        cursor?: string;
        status?: N8nExecution['status'];
        workflowId?: string;
    } = {}) => {
        const params = new URLSearchParams({ limit: String(opts.limit ?? 100) });
        if (opts.cursor) params.set('cursor', opts.cursor);
        if (opts.status) params.set('status', opts.status);
        if (opts.workflowId) params.set('workflowId', opts.workflowId);
        return n8nFetch<N8nExecutionList>(`/executions?${params.toString()}`);
    },

    /**
     * Fetches a single execution by ID, including full run data.
     * includeData=true asks n8n to include node I/O payloads (can be large).
     */
    getExecution: (executionId: string, includeData = false) =>
        n8nFetch<N8nExecution>(
            `/executions/${executionId}${includeData ? '?includeData=true' : ''}`,
        ),
};
