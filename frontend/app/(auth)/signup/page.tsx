'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthHero } from '../AuthHero';
import '../auth.css';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setError('');
        try {
            // TODO: wire to POST /api/v1/auth/send-otp
            await new Promise((r) => setTimeout(r, 1200)); // simulate
            setSent(true);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* ── Left hero ── */}
            <AuthHero
                title="Mastering"
                titleAccent="Automation"
                subtitle="Streamline your industrial workflows with our next-generation IBA dashboard."
            />

            {/* ── Right form ── */}
            <div className="auth-panel">
                <div className="auth-form-wrap">
                    <h2 className="auth-form-title">Sign Up</h2>
                    <p className="auth-form-subtitle">
                        Enter your email to effortlessly create an account with a magic link.
                    </p>

                    {/* Success state */}
                    {sent && (
                        <div className="auth-alert auth-alert-success">
                            ✅ A login link has been sent to <strong>{email}</strong>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="auth-alert auth-alert-error">⚠️ {error}</div>
                    )}

                    {!sent && (
                        <form onSubmit={handleMagicLink}>
                            <div className="auth-field">
                                <label className="auth-label" htmlFor="signup-email">Email Address</label>
                                <div className="auth-input-wrap">
                                    <span className="auth-input-icon">✉️</span>
                                    <input
                                        id="signup-email"
                                        type="email"
                                        className="auth-input"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="auth-btn-primary"
                                disabled={loading || !email}
                            >
                                {loading ? (
                                    <>
                                        <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                                        Sending…
                                    </>
                                ) : (
                                    <>Generate Magic Link 🪄</>
                                )}
                            </button>

                            <p className="auth-hint">A login link will be sent to your email.</p>
                        </form>
                    )}

                    <div className="auth-divider">OR</div>

                    <button
                        type="button"
                        className="auth-btn-google"
                        onClick={() => {/* TODO: Google OAuth */ }}
                    >
                        {/* Google G logo SVG */}
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="auth-helper" style={{ marginTop: 24 }}>
                        Already have an account?{' '}
                        <Link href="/login">Sign in</Link>
                    </p>

                    <p className="auth-helper">
                        Don&apos;t have an account?{' '}
                        <a href="mailto:admin@iba-platform.com" className="auth-link">Contact Admin</a>
                    </p>
                </div>

                {/* Footer */}
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
