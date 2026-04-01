'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthHero } from '../AuthHero';
import { OTPModal } from '../../components/OTPModal';
import '../auth.css';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showOTP, setShowOTP] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoading(true);
        setError('');
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Failed to login');
            }

            // Save the fast token to localStorage for Authorization headers
            localStorage.setItem('access_token', data.access_token);
            
            // Dispatch OTP
            const otpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'}/auth/send-otp`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.access_token}`
                },
                body: JSON.stringify({ email, purpose: 'login' }),
            });

            if (!otpRes.ok) {
                const otpData = await otpRes.json();
                throw new Error(otpData.error || 'Failed to dispatch verification code');
            }

            setShowOTP(true);
        } catch (err: unknown) {
            setError((err as Error).message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSuccess = () => {
        window.location.href = '/automations';
    };

    return (
        <div className="auth-page">
            <AuthHero
                title="Welcome"
                titleAccent="Back to"
                subtitle="Sign in to your IBA Platform account to manage your automation workflows."
            />

            <div className="auth-panel">
                <div className="auth-form-wrap">
                    <h2 className="auth-form-title">Sign In</h2>
                    <p className="auth-form-subtitle">
                        Enter your email and password to sign in.
                    </p>

                    {error && (
                        <div className="auth-alert auth-alert-error">⚠️ {error}</div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="login-email">Email Address</label>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon">✉️</span>
                                <input
                                    id="login-email"
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

                        <div className="auth-field" style={{ marginTop: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <label className="auth-label" htmlFor="login-password">Password</label>
                                <a href="#" style={{ fontSize: 12, color: '#00C2FF', textDecoration: 'none' }}>Forgot password?</a>
                            </div>
                            <div className="auth-input-wrap">
                                <span className="auth-input-icon">🔓</span>
                                <input
                                    id="login-password"
                                    type="password"
                                    className="auth-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-btn-primary"
                            disabled={loading || !email || !password}
                            style={{ marginTop: 24 }}
                        >
                            {loading ? '⏳ Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-divider">OR</div>

                    <a
                        href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'}/auth/google`}
                        className="auth-btn-google"
                        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </a>

                    <p className="auth-helper" style={{ marginTop: 24 }}>
                        Need an account?{' '}
                        <Link href="/signup">Sign up</Link>
                    </p>
                </div>

                <div className="auth-footer">
                    <a href="#" className="auth-footer-link">Documentation</a>
                    <a href="#" className="auth-footer-link">Support Portal</a>
                    <a href="#" className="auth-footer-link">Privacy Policy</a>
                    <a href="#" className="auth-footer-link">Global Network</a>
                </div>
            </div>

            {showOTP && (
                <OTPModal 
                    email={email} 
                    purpose="login"
                    onSuccess={handleOTPSuccess} 
                    onCancel={() => setShowOTP(false)} 
                />
            )}
        </div>
    );
}
