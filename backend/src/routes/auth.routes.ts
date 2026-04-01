import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { sendOtp, verifyOtp } from '../services/otp.service';
import { OtpPurpose } from '@prisma/client';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'fallback_refresh_secret_key';

// ── JWT + Password / Refresh Flows (Public) ───────────────────────

authRouter.post('/signup', async (req, res) => {
    try {
        const { email, password, first_name, last_name, company_name } = req.body;
        
        if (!email || !password || !first_name || !last_name) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password_hash,
                first_name,
                last_name,
                company_name,
                hourly_rate: 0,
            }
        });

        // Auto-login to allow protected OTP fetch
        const access_token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
        const refresh_token = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '30d' });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(201).json({ 
            success: true, 
            message: 'User created',
            access_token,
            user: { id: user.id, email: user.email, first_name: user.first_name }
        });
    } catch (error: any) {
        console.error('[POST /signup]', error);
        return res.status(500).json({ error: 'Failed to sign up' });
    }
});

authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate Access Token (15m)
        const access_token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
        
        // Generate Refresh Token (30d)
        const refresh_token = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '30d' });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(200).json({
            success: true,
            access_token,
            user: { id: user.id, email: user.email, first_name: user.first_name }
        });
    } catch (error: any) {
        console.error('[POST /login]', error);
        return res.status(500).json({ error: 'Failed to login' });
    }
});

authRouter.post('/refresh', async (req, res) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.status(401).json({ error: 'No refresh token provided' });
        }

        const decoded = jwt.verify(refresh_token, REFRESH_SECRET) as { userId: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const access_token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });

        return res.status(200).json({ success: true, access_token });
    } catch (error: any) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
});

// ── Secure MFA / OTP Operations (Protected) ───────────────────────

// POST /api/v1/auth/send-otp
authRouter.post('/send-otp', async (req, res) => {
    try {
        const { email, purpose } = req.body;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!email || !purpose) {
            return res.status(400).json({ error: 'Email and purpose are required.' });
        }

        await sendOtp(userId, email, purpose as OtpPurpose);

        return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
    } catch (error: any) {
        console.error('send-otp error:', error);
        return res.status(500).json({ success: false, error: 'Failed to send OTP' });
    }
});

// POST /api/v1/auth/verify-otp
authRouter.post('/verify-otp', async (req, res) => {
    try {
        const { code, purpose } = req.body;
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!code || !purpose) {
            return res.status(400).json({ error: 'Code and purpose are required.' });
        }

        // verifyOtp returns a 5-min TTL view_token
        const view_token = await verifyOtp(userId, code, purpose as OtpPurpose);

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully.',
            view_token,
        });
    } catch (error: any) {
        console.error('verify-otp error:', error);
        return res.status(400).json({ success: false, error: 'OTP is invalid or expired.' });
    }
});

// ── Google OAuth 2.0 ───────────────────────────────────────────────
import https from 'https';

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID ?? '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? '';
const GOOGLE_REDIRECT_URI  = process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:4000/api/v1/auth/google/callback';

// GET /api/v1/auth/google — redirect user to Google consent screen
authRouter.get('/google', (_req, res) => {
    if (!GOOGLE_CLIENT_ID) {
        return res.status(500).json({ error: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID in .env' });
    }
    const params = new URLSearchParams({
        client_id:     GOOGLE_CLIENT_ID,
        redirect_uri:  GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope:         'openid email profile',
        access_type:   'offline',
        prompt:        'select_account',
    });
    return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// GET /api/v1/auth/google/callback — Google sends user back here with ?code=
authRouter.get('/google/callback', async (req, res) => {
    const code = req.query.code as string;
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    if (!code) return res.redirect(`${frontendUrl}/login?error=google_denied`);

    try {
        // 1. Exchange code for access_token
        const tokenData = await new Promise<any>((resolve, reject) => {
            const body = new URLSearchParams({
                code,
                client_id:     GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri:  GOOGLE_REDIRECT_URI,
                grant_type:    'authorization_code',
            }).toString();

            const options = {
                hostname: 'oauth2.googleapis.com',
                path:     '/token',
                method:   'POST',
                headers:  {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(body),
                },
            };
            const r = https.request(options, (resp) => {
                let data = '';
                resp.on('data', (chunk) => { data += chunk; });
                resp.on('end', () => { try { resolve(JSON.parse(data)); } catch { reject(new Error('Token parse error')); } });
            });
            r.on('error', reject);
            r.write(body);
            r.end();
        });

        if (tokenData.error) throw new Error(tokenData.error_description ?? 'Google token exchange failed');

        // 2. Fetch Google profile
        const profile = await new Promise<any>((resolve, reject) => {
            const r = https.request({
                hostname: 'www.googleapis.com',
                path:     '/oauth2/v2/userinfo',
                method:   'GET',
                headers:  { Authorization: `Bearer ${tokenData.access_token}` },
            }, (resp) => {
                let data = '';
                resp.on('data', (chunk) => { data += chunk; });
                resp.on('end', () => { try { resolve(JSON.parse(data)); } catch { reject(new Error('Profile parse error')); } });
            });
            r.on('error', reject);
            r.end();
        });

        const { email, given_name, family_name } = profile;
        if (!email) throw new Error('No email returned from Google');

        // 3. Upsert user — Google users use a placeholder password_hash
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    password_hash: `google_oauth_${Date.now()}`,
                    first_name: given_name ?? 'Google',
                    last_name:  family_name ?? 'User',
                    hourly_rate: 0,
                },
            });
        }

        // 4. Issue IBA JWTs
        const access_token  = jwt.sign({ userId: user.id }, JWT_SECRET,     { expiresIn: '15m' });
        const refresh_token = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '30d' });

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure:   process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge:   30 * 24 * 60 * 60 * 1000,
        });

        // 5. Redirect frontend with token — frontend page reads it and stores in localStorage
        return res.redirect(`${frontendUrl}/auth/google-success?token=${access_token}&name=${encodeURIComponent(user.first_name)}`);
    } catch (err: any) {
        console.error('[Google OAuth Callback]', err.message);
        return res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/login?error=google_failed`);
    }
});
