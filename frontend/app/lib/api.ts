// Typed fetch helpers for the IBA backend API.
// All calls are made server-side (RSC) or client-side via these helpers.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

type FetchOptions = RequestInit & { next?: { revalidate?: number | false } };

async function apiFetch<T>(path: string, options?: FetchOptions): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers ?? {}),
        },
    });

    if (!res.ok) {
        const body = await res.text().catch(() => res.statusText);
        throw new Error(`[API] ${res.status} ${path}: ${body}`);
    }

    const json = await res.json();
    return json.data ?? json;
}

// ── Stats endpoints ─────────────────────────────────────────

import type { StatsSummary, RunsResponse } from './types';

export async function fetchStatsSummary(): Promise<StatsSummary> {
    return apiFetch<StatsSummary>('/stats/summary', {
        // Revalidate every 30s when called from a Server Component
        next: { revalidate: 30 },
    });
}

export async function fetchRuns(params?: {
    workflowId?: string;
    status?: string;
    limit?: number;
    cursor?: string;
}): Promise<RunsResponse> {
    const qs = new URLSearchParams();
    if (params?.workflowId) qs.set('workflowId', params.workflowId);
    if (params?.status) qs.set('status', params.status);
    if (params?.limit) qs.set('limit', String(params.limit));
    if (params?.cursor) qs.set('cursor', params.cursor);

    const query = qs.toString() ? `?${qs.toString()}` : '';
    return apiFetch<RunsResponse>(`/stats/runs${query}`);
}
