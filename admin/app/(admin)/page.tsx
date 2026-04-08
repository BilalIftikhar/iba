'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '../lib/api';
import { DashboardClient } from '../components/DashboardClient';

export default function AdminDashboardPage() {
    const [data, setData] = useState<any>(null);
    const [threads, setThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadData() {
            try {
                const [statsData, messagesData] = await Promise.all([
                    adminFetch<any>('/stats'),
                    adminFetch<any[]>('/messages')
                ]);
                setData(statsData);
                setThreads(messagesData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin w-8 h-8 text-[#00C2FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest animate-pulse">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {error}
                </div>
            </div>
        );
    }

    if (!data) return null;

    return <DashboardClient data={data} threads={threads} />;
}
