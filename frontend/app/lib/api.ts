// Typed fetch helpers for the IBA backend API.
// All calls are made server-side (RSC) or client-side via these helpers.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

type FetchOptions = RequestInit & { next?: { revalidate?: number | false } };

export async function apiFetch<T>(path: string, options?: FetchOptions): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const res = await fetch(`${API_BASE}${path}`, {
        credentials: 'include',
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...(options?.headers ?? {}),
        },
    });

    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        } else {
            console.error('[API] 401 Unauthorized during server-side fetch.');
        }
        throw new Error('[API] 401 Unauthorized');
    }

    if (!res.ok) {
        const body = await res.text().catch(() => res.statusText);
        throw new Error(`[API] ${res.status} ${path}: ${body}`);
    }

    const json = await res.json();
    return json.data ?? json;
}

export async function createBooking<T = unknown>(data: Record<string, unknown>): Promise<T> {
    return apiFetch<T>('/bookings', {
        method: 'POST',
        body: JSON.stringify(data)
    });
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
