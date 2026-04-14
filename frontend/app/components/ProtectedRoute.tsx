'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.replace('/login');
            return;
        }
        setIsAuthenticated(true);

        // ── 10-minute inactivity auto-logout ──────────────────────
        const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes
        let inactivityTimer: ReturnType<typeof setTimeout>;

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                localStorage.removeItem('access_token');
                window.location.href = '/login?reason=inactivity';
            }, INACTIVITY_LIMIT);
        };

        const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
        activityEvents.forEach(evt => window.addEventListener(evt, resetInactivityTimer, { passive: true }));
        resetInactivityTimer();

        return () => {
            clearTimeout(inactivityTimer);
            activityEvents.forEach(evt => window.removeEventListener(evt, resetInactivityTimer));
        };
    }, [router]);

    if (!isAuthenticated) return null; // Wait for check

    return <>{children}</>;
}
