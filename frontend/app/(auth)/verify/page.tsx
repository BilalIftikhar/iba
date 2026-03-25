'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import Link from 'next/link';
import { AuthHero } from '../AuthHero';
import '../auth.css';

const CODE_LENGTH = 6;

export default function VerifyPage() {
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
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

    const fullCode = code.join('');
    const isComplete = fullCode.length === CODE_LENGTH;

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isComplete) return;
        setLoading(true);
        setError('');
        try {
            // TODO: POST /api/v1/auth/verify-otp { code: fullCode, purpose: 'login' }
            await new Promise((r) => setTimeout(r, 1000));
            setSuccess(true);
        } catch {
            setError('Invalid code. Please check and try again.');
            setCode(Array(CODE_LENGTH).fill(''));
            inputs.current[0]?.focus();
        } finally {
            setLoading(false);
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
                        We&apos;ve sent a 6-digit verification code to your email. It expires in 10 minutes.
                    </p>

                    {success && (
                        <div className="auth-alert auth-alert-success">
                            ✅ Identity verified! Redirecting to your dashboard…
                        </div>
                    )}

                    {error && (
                        <div className="auth-alert auth-alert-error">⚠️ {error}</div>
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

                            <button
                                type="submit"
                                className="auth-btn-primary"
                                disabled={!isComplete || loading}
                            >
                                {loading ? '⏳ Verifying…' : 'Verify & Sign In →'}
                            </button>

                            <p className="auth-helper" style={{ marginTop: 20 }}>
                                Didn&apos;t receive it?{' '}
                                <a href="#" className="auth-link" onClick={(e) => { e.preventDefault(); /* resend */ }}>
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
