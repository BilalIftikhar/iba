import { Router } from 'express';
// Note: We extended Express.Request with StrictAuthProp in auth.middleware.ts, 
// so req.auth is directly accessible via the standard Request.
import { sendOtp, verifyOtp } from '../services/otp.service';
import { OtpPurpose } from '@prisma/client';

export const authRouter = Router();

// POST /api/v1/auth/send-otp
authRouter.post('/send-otp', async (req, res) => {
    try {
        const { email, purpose } = req.body;

        // Auth is guaranteed by ClerkExpressRequireAuth globally or per route
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized via Clerk' });
        }

        if (!email || !purpose) {
            return res.status(400).json({ error: 'Email and purpose are required.' });
        }

        const otpPurpose = purpose as OtpPurpose;

        await sendOtp(userId, email, otpPurpose);

        return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
    } catch (error: any) {
        console.error('send-otp error:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// POST /api/v1/auth/verify-otp
authRouter.post('/verify-otp', async (req, res) => {
    try {
        const { code, purpose } = req.body;
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized via Clerk' });
        }

        if (!code || !purpose) {
            return res.status(400).json({ error: 'Code and purpose are required.' });
        }

        const otpPurpose = purpose as OtpPurpose;

        // verifyOtp now returns a short-lived view_token (5-min TTL) per spec §7.1
        const view_token = await verifyOtp(userId, code, otpPurpose);

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

