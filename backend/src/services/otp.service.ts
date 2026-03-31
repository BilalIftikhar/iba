import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { prisma } from '../lib/prisma';
import { OtpPurpose } from '@prisma/client';

const OTP_VALIDITY_MINUTES = 10;
const OTP_DIGITS = 6;

/** Short-lived view_token TTL: 5 minutes, per spec §7.1 */
const VIEW_TOKEN_TTL_MS = 5 * 60 * 1_000;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY || 're_NLE68m1D_GWWiqbAtAMZMZmA5TXgd8BbA');

// ─────────────────────────────────────────────────────────────
// Internal helpers for view_token
// ─────────────────────────────────────────────────────────────

/**
 * Returns the secret used to HMAC-sign view tokens.
 * Falls back to CREDENTIAL_ENCRYPTION_KEY so we don't need an extra env var,
 * but OTP_VIEW_TOKEN_SECRET can be set independently for key separation.
 */
const getViewTokenSecret = (): string => {
    const secret = process.env.OTP_VIEW_TOKEN_SECRET ?? process.env.CREDENTIAL_ENCRYPTION_KEY;
    if (!secret) {
        throw new Error('OTP_VIEW_TOKEN_SECRET (or CREDENTIAL_ENCRYPTION_KEY) is not configured');
    }
    return secret;
};

interface ViewTokenPayload {
    userId: string;
    purpose: OtpPurpose;
    exp: number; // Unix ms timestamp of expiry
}

/**
 * Signs a ViewTokenPayload with HMAC-SHA256.
 * Format: base64url(<json_payload>).<base64url(<hmac_signature>)>
 */
const signViewToken = (payload: ViewTokenPayload): string => {
    const secret = getViewTokenSecret();
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('base64url');
    return `${body}.${sig}`;
};

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/**
 * Generates a 6-digit OTP, hashes it, stores it in the database,
 * and sends the plain code via Resend to the provided email.
 */
export const sendOtp = async (
    userId: string,
    email: string,
    purpose: OtpPurpose,
): Promise<void> => {
    // 1. Invalidate any existing active OTPs for this user and purpose
    await prisma.otpCode.updateMany({
        where: { user_id: userId, purpose, used_at: null },
        data: { used_at: new Date() },
    });

    // 2. Generate a secure 6-digit code
    const rawCode = crypto.randomInt(0, 1_000_000).toString().padStart(OTP_DIGITS, '0');

    // 3. Hash the code using bcrypt
    const code_hash = await bcrypt.hash(rawCode, 10);

    // 4. Calculate expiration timestamp
    const expires_at = new Date();
    expires_at.setMinutes(expires_at.getMinutes() + OTP_VALIDITY_MINUTES);

    // 5. Save the hashed OTP to the otp_codes table using Prisma
    await prisma.otpCode.create({
        data: {
            user_id: userId,
            code_hash,
            purpose,
            expires_at,
        },
    });

    // 6. Send the plain code via Resend
    console.log(`\n\n[DEV MODE] 🔐 OTP CODE GENERATED FOR ${email}: ${rawCode}\n\n`);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: email,
            subject: 'Your IBA Dashboard Verification Code',
            text: `Your verification code is ${rawCode}. It will expire in ${OTP_VALIDITY_MINUTES} minutes.`,
            html: `<p>Your verification code is <strong>${rawCode}</strong>. It will expire in ${OTP_VALIDITY_MINUTES} minutes.</p>`,
        });

        if (error) {
            console.error('Resend API Error:', error);
            throw new Error(`Resend Error: ${error.message}`);
        }
    } catch (error: any) {
        console.error('Failed to send email via Resend SDK:', error);
        throw new Error(error.message || 'Failed to send OTP email via Resend SDK');
    }
};

/**
 * Verifies the provided OTP code, marks it as used, and returns
 * a short-lived signed view_token (5-minute TTL) as required by spec §7.1.
 *
 * Throws an error if the OTP is invalid, expired, or already used.
 */
export const verifyOtp = async (
    userId: string,
    rawCode: string,
    purpose: OtpPurpose,
): Promise<string> => {
    const otpRecord = await prisma.otpCode.findFirst({
        where: {
            user_id: userId,
            purpose,
            used_at: null,
            expires_at: { gt: new Date() },
        },
        orderBy: { created_at: 'desc' },
    });

    if (!otpRecord) {
        throw new Error('OTP is invalid or has expired');
    }

    // Verify the hash
    const isValid = await bcrypt.compare(rawCode, otpRecord.code_hash);
    if (!isValid) {
        throw new Error('Invalid OTP code');
    }

    // Mark as used — single-use guarantee
    await prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { used_at: new Date() },
    });

    // Issue a short-lived view_token scoped to this user + purpose
    const viewToken = signViewToken({
        userId,
        purpose,
        exp: Date.now() + VIEW_TOKEN_TTL_MS,
    });

    return viewToken;
};

/**
 * Validates a view_token from the X-OTP-TOKEN header.
 * Returns the decoded payload if valid, or throws if invalid / expired / tampered.
 */
export const validateViewToken = (token: string, expectedUserId: string, expectedPurpose: OtpPurpose): ViewTokenPayload => {
    const parts = token.split('.');
    if (parts.length !== 2) {
        throw new Error('Malformed view token');
    }

    const [body, sig] = parts;
    const secret = getViewTokenSecret();

    // Constant-time signature verification to prevent timing attacks
    const expectedSig = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('base64url');

    const sigBuffer = Buffer.from(sig, 'base64url');
    const expectedSigBuffer = Buffer.from(expectedSig, 'base64url');

    if (
        sigBuffer.length !== expectedSigBuffer.length ||
        !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)
    ) {
        throw new Error('Invalid view token signature');
    }

    let payload: ViewTokenPayload;
    try {
        payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    } catch {
        throw new Error('Malformed view token payload');
    }

    if (Date.now() > payload.exp) {
        throw new Error('View token has expired');
    }

    if (payload.userId !== expectedUserId) {
        throw new Error('View token user mismatch');
    }

    if (payload.purpose !== expectedPurpose) {
        throw new Error('View token purpose mismatch');
    }

    return payload;
};
