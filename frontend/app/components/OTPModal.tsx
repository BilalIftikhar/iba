'use client';

import { useState, useRef, KeyboardEvent } from 'react';

const CODE_LENGTH = 6;

interface OTPModalProps {
    email: string;
    purpose: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function OTPModal({ email, purpose, onSuccess, onCancel }: OTPModalProps) {
    const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState('');
    const inputs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (i: number, val: string) => {
        const digit = val.replace(/\D/g, '').slice(-1);
        const next = [...code];
        next[i] = digit;
        setCode(next);
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
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ email, code: fullCode, purpose })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Invalid code. Please check and try again.');
            onSuccess();
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
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'}/auth/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ email, purpose })
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
        <>
            <style>{`
                .otp-backdrop {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.65);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 16px;
                    box-sizing: border-box;
                }
                .otp-modal {
                    background: #ffffff;
                    border-radius: 24px;
                    padding: 32px;
                    width: 100%;
                    max-width: 440px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                    position: relative;
                    box-sizing: border-box;
                }
                .otp-grid {
                    display: flex;
                    gap: clamp(6px, 2vw, 12px);
                    justify-content: center;
                    margin-bottom: 24px;
                }
                .otp-cell {
                    width: clamp(38px, 12vw, 60px);
                    height: clamp(46px, 13vw, 64px);
                    text-align: center;
                    font-size: clamp(18px, 5vw, 26px);
                    font-weight: 700;
                    font-family: Inter, sans-serif;
                    border: 2px solid #E2E8F0;
                    border-radius: 12px;
                    background: #F8FAFC;
                    outline: none;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
                    color: #0F172A;
                    caret-color: #00C2FF;
                    flex-shrink: 1;
                    min-width: 0;
                }
                .otp-cell:focus {
                    border-color: #00C2FF;
                    background: #ffffff;
                    box-shadow: 0 0 0 3px rgba(0, 194, 255, 0.18);
                }
                @media (max-width: 400px) {
                    .otp-modal {
                        padding: 24px 16px;
                        border-radius: 20px;
                    }
                    .otp-cell {
                        border-radius: 10px;
                    }
                    .otp-grid {
                        gap: 5px;
                    }
                }
            `}</style>

            <div className="otp-backdrop">
                <div className="otp-modal">
                    {/* Close button */}
                    <button
                        onClick={onCancel}
                        style={{
                            position: 'absolute', top: '16px', right: '16px',
                            background: 'transparent', border: 'none',
                            fontSize: '20px', cursor: 'pointer', color: '#64748B', lineHeight: 1,
                        }}
                    >
                        &times;
                    </button>

                    <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 'clamp(20px, 5vw, 24px)', color: '#0F172A', marginBottom: '8px', textAlign: 'center' }}>
                        Enter Code
                    </h2>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#64748B', textAlign: 'center', marginBottom: '24px', lineHeight: '1.6' }}>
                        We&apos;ve sent a 6-digit verification code to{' '}
                        <strong style={{ color: '#0F172A', wordBreak: 'break-all' }}>{email}</strong>.{' '}
                        It expires in 10 minutes.
                    </p>

                    {error && (
                        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
                            ⚠️ {error}
                        </div>
                    )}
                    {resendMessage && !error && (
                        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
                            ℹ️ {resendMessage}
                        </div>
                    )}

                    <form onSubmit={handleVerify}>
                        {/* OTP Boxes */}
                        <div className="otp-grid" onPaste={handlePaste}>
                            {code.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { inputs.current[i] = el; }}
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

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={handleClear}
                                style={{ flex: 1, padding: '13px', backgroundColor: '#F1F5F9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
                            >
                                Clear
                            </button>
                            <button
                                type="submit"
                                disabled={!isComplete || loading}
                                style={{ flex: 2, padding: '13px', backgroundColor: '#00C2FF', border: 'none', borderRadius: '12px', color: '#ffffff', fontWeight: 800, cursor: (!isComplete || loading) ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '15px', opacity: !isComplete ? 0.65 : 1, transition: 'opacity 0.15s' }}
                            >
                                {loading ? '⏳ Verifying…' : 'Verify →'}
                            </button>
                        </div>

                        <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748B', fontFamily: 'Inter, sans-serif' }}>
                            Didn&apos;t receive it?{' '}
                            <a href="#" onClick={handleResend} style={{ color: '#00C2FF', fontWeight: 700, textDecoration: 'none' }}>
                                Resend code
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}
