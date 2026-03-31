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

