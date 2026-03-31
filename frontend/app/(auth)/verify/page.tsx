'use client';

import { useState, useRef, KeyboardEvent, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthHero } from '../AuthHero';
import '../auth.css';

const CODE_LENGTH = 6;

function VerifyContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState('');
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (i: number, val: string) => {
        // Only accept single digit
        const digit = val.replace(/\D/g, '').slice(-1);
        const next = [...code];
        next[i] = digit;
        setCode(next);
        // Auto-advance
        if (digit && i < CODE_LENGTH - 1) {
            inputs.current[i + 1]?.focus();
        }
    };

    const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[i] && i > 0) {
            inputs.current[i - 1]?.focus();
        }
        if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus();
        if (e.key === 'ArrowRight' && i < CODE_LENGTH - 1) inputs.current[i + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH);
        const next = [...code];
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setCode(next);
        // Focus last filled cell
        inputs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
    };

    const handleClear = () => {
        setCode(Array(CODE_LENGTH).fill(''));
        setError('');
        setResendMessage('');
        inputs.current[0]?.focus();
    };

    const fullCode = code.join('');
    const isComplete = fullCode.length === CODE_LENGTH;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isComplete) return;
        setLoading(true);
        setError('');
        setResendMessage('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: fullCode, purpose: 'login' })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid code. Please check and try again.');

            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
            }

            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/automations';
            }, 1000);
        } catch (err: unknown) {
            setError((err as Error).message);
            setCode(Array(CODE_LENGTH).fill(''));
            inputs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async (e: React.MouseEvent) => {
        e.preventDefault();
        setError('');
        setResendMessage('');
        if (!email) {
            setError('Missing email address. Cannot resend.');
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose: 'login' })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to resend code');
            }
            setResendMessage('A new verification code has been sent.');
            setCode(Array(CODE_LENGTH).fill(''));
            inputs.current[0]?.focus();
        } catch (err: unknown) {
            setError((err as Error).message);
        }
    };

    return (
        <div className="auth-page">
            <AuthHero
                title="Secure"
                titleAccent="Verification"
                subtitle="Enter the 6-digit code we sent to your email to verify your identity."
            />

            <div className="auth-panel">
                <div className="auth-form-wrap">
                    <h2 className="auth-form-title">Enter Code</h2>
                    <p className="auth-form-subtitle">
                        We&apos;ve sent a 6-digit verification code to {email || 'your email'}. It expires in 10 minutes.
                    </p>

                    {success && (
                        <div className="auth-alert auth-alert-success">
                            ✅ Identity verified! Redirecting to your dashboard…
                        </div>
                    )}

                    {error && (
                        <div className="auth-alert auth-alert-error">⚠️ {error}</div>
                    )}

                    {resendMessage && !error && !success && (
                        <div className="auth-alert auth-alert-success">ℹ️ {resendMessage}</div>
                    )}

                    {!success && (
                        <form onSubmit={handleVerify}>
                            {/* 6-cell OTP grid */}
                            <div className="otp-grid" onPaste={handlePaste}>
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputs.current[i] = el; }}
                                        id={`otp-cell-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        maxLength={1}
                                        className="otp-cell"
                                        value={digit}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        autoFocus={i === 0}
                                        autoComplete="one-time-code"
                                    />
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    style={{ flex: 1, padding: '12px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
                                >
                                    Clear
                                </button>
                                <button
                                    type="submit"
                                    className="auth-btn-primary"
                                    disabled={!isComplete || loading}
                                    style={{ flex: 2, marginTop: 0 }}
                                >
                                    {loading ? '⏳ Verifying…' : 'Verify & Sign In →'}
                                </button>
                            </div>

                            <p className="auth-helper" style={{ marginTop: 24, textAlign: 'center' }}>
                                Didn&apos;t receive it?{' '}
                                <a href="#" className="auth-link" onClick={handleResend}>
                                    Resend code
                                </a>
                            </p>
                        </form>
                    )}

                    <div style={{ marginTop: 32 }}>
                        <Link href="/login" className="auth-helper" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', color: '#64748b' }}>
                            ← Back to sign in
                        </Link>
                    </div>
                </div>

                <div className="auth-footer">
                    <a href="#" className="auth-footer-link">Documentation</a>
                    <a href="#" className="auth-footer-link">Support Portal</a>
                    <a href="#" className="auth-footer-link">Privacy Policy</a>
                    <a href="#" className="auth-footer-link">Global Network</a>
                </div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="auth-page"><div className="auth-panel" style={{margin:'auto', padding:'40px'}}>Loading...</div></div>}>
            <VerifyContent />
        </Suspense>
    );
}
