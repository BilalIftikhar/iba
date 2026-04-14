'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { setAdminToken } from '../lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const searchParams = useSearchParams();
    const logoutReason = searchParams.get('reason');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error ?? 'Login failed');
            }

            setAdminToken(data.access_token);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.message ?? 'Login failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-[400px]">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-baseline gap-0.5 mb-2">
                        <span className="text-3xl font-black text-slate-800 tracking-tight">IBA</span>
                        <span className="text-3xl font-black text-[#00C2FF]">.</span>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#00C2FF]/10 text-[#0099CC] text-xs font-bold px-3 py-1.5 rounded-full">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                        ADMIN PANEL
                    </div>
                    <p className="text-slate-500 text-sm mt-3">Sign in with your admin credentials</p>
                </div>

                {/* Session expired / Inactivity notice */}
                {logoutReason && (
                    <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400e' }}>
                            {logoutReason === 'inactivity' ? 'You were logged out due to 10 minutes of inactivity.' : 'Your session has expired. Please sign in again.'}
                        </span>
                    </div>
                )}

                {/* Card */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Email
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@iba.si"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
                                Password
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full justify-center mt-2 py-3"
                        >
                            {loading ? (
                                <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                            )}
                            {loading ? 'Signing in…' : 'Sign in to Admin'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Access restricted to IBA administrators only.
                </p>
            </div>
        </div>
    );
}
