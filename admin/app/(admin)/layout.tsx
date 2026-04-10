'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminToken, adminFetch } from '../lib/api';
import { AdminSidebar } from '../components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [badges, setBadges] = useState({ activeBookings: 0, unreadMessages: 0, totalBookings: 0 });

    useEffect(() => {
        const token = getAdminToken();
        if (!token) {
            router.push('/login');
            return;
        }

        // Fetch initial stats for badges
        adminFetch<{ activeBookings: number; unreadMessages: number; totalBookings: number }>('/stats')
            .then(data => setBadges({ 
                activeBookings: data.activeBookings || 0, 
                unreadMessages: data.unreadMessages || 0,
                totalBookings: data.totalBookings || 0
            }))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-dvh flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin w-8 h-8 text-[#00C2FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-widest animate-pulse">Loading Admin...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-dvh bg-slate-50 overflow-hidden">
            <AdminSidebar badges={badges} />
            {/* Desktop Sidebar Spacer */}
            <div className="hidden lg:block w-[260px] shrink-0"></div>
            <main className="flex-1 pt-14 lg:pt-0 min-w-0 h-dvh overflow-y-auto" id="admin-main">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
