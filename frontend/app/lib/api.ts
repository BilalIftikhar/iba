// Typed fetch helpers for the IBA backend API.
// All calls are made server-side (RSC) or client-side via these helpers.

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

type FetchOptions = RequestInit & { next?: { revalidate?: number | false } };

// Silently exchange the HttpOnly refresh_token cookie for a new access_token.
async function tryRefreshToken(): Promise<string | null> {
    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include', // sends the HttpOnly refresh_token cookie
        });
        if (!res.ok) return null;
        const data = await res.json();
        const newToken = data.access_token;
        if (newToken && typeof window !== 'undefined') {
            localStorage.setItem('access_token', newToken);
        }
        return newToken ?? null;
    } catch {
        return null;
    }
}

export async function apiFetch<T>(path: string, options?: FetchOptions): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const makeRequest = (tok: string | null) =>
        fetch(`${API_BASE}${path}`, {
            credentials: 'include',
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(tok ? { 'Authorization': `Bearer ${tok}` } : {}),
                ...(options?.headers ?? {}),
            },
        });

    let res = await makeRequest(token);

    // If expired, silently refresh and retry ONCE
    if (res.status === 401 && typeof window !== 'undefined') {
        const newToken = await tryRefreshToken();
        if (newToken) {
            res = await makeRequest(newToken);
        }
    }

    // Still 401 after refresh attempt → clear and send to login
    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
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

/**
 * Save a booking as a draft, persisting the full multi-step wizard state.
 * draft_state is stored as JSONB and can be used to restore the form on next visit.
 */
export async function saveDraft<T = unknown>(payload: {
    type: 'automation' | 'cowork' | 'custom_app' | 'implementation';
    title?: string;
    use_case?: string;
    tools_list?: unknown[];
    draft_state: Record<string, unknown>;
}): Promise<T> {
    return apiFetch<T>('/bookings', {
        method: 'POST',
        body: JSON.stringify({ ...payload, status: 'draft' })
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

export async function fetchProfile<T = any>(): Promise<T> {
    return apiFetch<T>('/auth/me');
}

export async function updateProfile<T = any>(data: Record<string, unknown>): Promise<T> {
    return apiFetch<T>('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}

export async function fetchSubscription<T = any>(): Promise<T> {
    return apiFetch<T>('/subscriptions/me');
}

export async function fetchTeam<T = any>(): Promise<T[]> {
    return apiFetch<T[]>('/teams');
}

export async function inviteTeamMember<T = any>(email: string, role: string): Promise<T> {
    return apiFetch<T>('/teams', {
        method: 'POST',
        body: JSON.stringify({ email, role })
    });
}

export async function deleteTeamMember<T = any>(id: string): Promise<T> {
    return apiFetch<T>(`/teams/${id}`, { method: 'DELETE' });
}

export async function fetchBookings<T = any>(): Promise<T[]> {
    return apiFetch<T[]>('/bookings');
}

export async function fetchCredentials<T = any>(): Promise<T[]> {
    return apiFetch<T[]>('/credentials');
}

export async function createCredential<T = unknown>(data: Record<string, unknown>): Promise<T> {
    return apiFetch<T>('/credentials', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export async function updateCredential<T = unknown>(id: string, data: Record<string, unknown>): Promise<T> {
    return apiFetch<T>(`/credentials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}

export async function deleteCredential<T = unknown>(id: string): Promise<T> {
    return apiFetch<T>(`/credentials/${id}`, {
        method: 'DELETE'
    });
}
