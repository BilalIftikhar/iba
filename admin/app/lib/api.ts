// Admin API utility — same backend, /api/v1/admin/* endpoints
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

async function tryRefreshToken(): Promise<string | null> {
    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!res.ok) return null;
        const data = await res.json();
        const newToken = data.access_token;
        if (newToken && typeof window !== 'undefined') {
            localStorage.setItem('admin_token', newToken);
        }
        return newToken ?? null;
    } catch {
        return null;
    }
}

export async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Automatically prepend '/admin' unless we are intentionally hitting the generic '/auth' or '/upload' modules
    const prefix = (normalizedPath.startsWith('/auth') || normalizedPath.startsWith('/upload')) ? '' : '/admin';
    
    const makeRequest = (tok: string | null) =>
        fetch(`${API_BASE}${prefix}${normalizedPath}`, {
            credentials: 'include',
            ...options,
            headers: {
                ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                ...(tok ? { 'Authorization': `Bearer ${tok}` } : {}),
                ...(options?.headers ?? {}),
            },
        });

    let res = await makeRequest(token);

    if (res.status === 401 && typeof window !== 'undefined') {
        const newToken = await tryRefreshToken();
        if (newToken) {
            res = await makeRequest(newToken);
        }
    }

    if (res.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_token');
            window.location.href = '/login';
        }
        throw new Error('[AdminAPI] 401 Unauthorized');
    }

    if (res.status === 403) {
        throw new Error('[AdminAPI] 403 Forbidden - Not an admin');
    }

    if (!res.ok) {
        const body = await res.text().catch(() => res.statusText);
        throw new Error(`[AdminAPI] ${res.status} ${path}: ${body}`);
    }

    const json = await res.json();
    return json.data ?? json;
}

export function getAdminToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token');
}

export function setAdminToken(token: string): void {
    if (typeof window !== 'undefined') {
        localStorage.setItem('admin_token', token);
    }
}

export function clearAdminToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
    }
}

export async function adminUploadFile(file: File): Promise<{ url: string; name: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // hits the generic /upload endpoint (shared)
    return adminFetch<{ url: string; name: string }>('/upload', {
        method: 'POST',
        body: formData
    });
}
