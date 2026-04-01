'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function GoogleSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const name = searchParams.get('name');

        if (token) {
            localStorage.setItem('access_token', token);
            if (name) localStorage.setItem('user_name', name);
            router.replace('/automations');
        } else {
            router.replace('/login?error=google_failed');
        }
    }, [searchParams, router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            fontFamily: 'Inter, sans-serif',
        }}>
            <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: '4px solid #e0f2fe',
                borderTop: '4px solid #00C2FF',
                animation: 'spin 0.8s linear infinite',
                marginBottom: 24,
            }} />
            <p style={{ color: '#475569', fontSize: 16, fontWeight: 600 }}>Signing you in with Google…</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default function GoogleSuccessPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
            <GoogleSuccessContent />
        </Suspense>
    );
}
