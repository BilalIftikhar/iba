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
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    if (!isAuthenticated) return null; // Wait for check

    return <>{children}</>;
}
