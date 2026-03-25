/**
 * credentials.routes.ts
 * CRUD operations for client credentials (API Keys, Webhooks, Software accounts).
 *
 * Security Model (IBA_Dashboard_Technical_Spec §7.1 – §7.3):
 *  - Sensitive fields are encrypted at rest (AES-256-GCM) via encryption.service.
 *  - List/Get endpoints return metadata ONLY — encrypted placeholder values are masked.
 *  - The /reveal endpoint requires a valid view_token in the X-OTP-TOKEN header.
 *    The token is issued by POST /api/v1/auth/verify-otp (purpose: credential_reveal).
 *  - Every reveal event is appended to the credentials_audit_log table.
 */
import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { encryptFields, decryptFields, EncryptedFields } from '../services/encryption.service';
import { validateViewToken } from '../services/otp.service';
import { CredentialType, CredentialEnvironment, OtpPurpose } from '@prisma/client';

export const credentialsRouter = Router();

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Returns the masked credential metadata without any encrypted payload */
const maskCredential = (cred: {
    id: string;
    client_id: string;
    type: CredentialType;
    name: string;
    service: string | null;
    environment: CredentialEnvironment;
    added_at: Date;
    last_used_at: Date | null;
}) => ({
    id: cred.id,
    client_id: cred.client_id,
    type: cred.type,
    name: cred.name,
    service: cred.service,
    environment: cred.environment,
    added_at: cred.added_at,
    last_used_at: cred.last_used_at,
    // Sensitive fields are intentionally omitted
    fields_encrypted: '[REDACTED — use /reveal with OTP token]',
});

// ─────────────────────────────────────────────────────────────
// GET /api/v1/credentials
// Lists all active (non-deleted) credentials for the authenticated client.
// Returns metadata only — no decrypted values ever.
// ─────────────────────────────────────────────────────────────
credentialsRouter.get('/', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;

        const credentials = await prisma.credential.findMany({
            where: { client_id: userId, deleted_at: null },
            orderBy: { added_at: 'desc' },
            select: {
                id: true,
                client_id: true,
                type: true,
                name: true,
                service: true,
                environment: true,
                added_at: true,
                last_used_at: true,
            },
        });

        return res.status(200).json({
            success: true,
            data: credentials.map(maskCredential),
        });
    } catch (error: any) {
        console.error('[GET /credentials]', error);
        return res.status(500).json({ success: false, error: 'Failed to fetch credentials.' });
    }
});

// ─────────────────────────────────────────────────────────────
// POST /api/v1/credentials
// Creates a new credential. Sensitive fields are encrypted before storage.
//
// Request body:
//  {
//    type: 'api_key' | 'webhook' | 'software',
//    name: string,
//    service?: string,
//    environment?: 'production' | 'staging' | 'development',
//    fields: { [fieldName: string]: string }   ← plain-text sensitive values
//  }
// ─────────────────────────────────────────────────────────────
credentialsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { type, name, service, environment, fields } = req.body;

        if (!type || !name || !fields || typeof fields !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'type, name, and fields are required.',
            });
        }

        // Validate credential type
        const validTypes: CredentialType[] = ['api_key', 'webhook', 'software'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                error: `Invalid type. Must be one of: ${validTypes.join(', ')}.`,
            });
        }

        // Encrypt all sensitive fields via AES-256-GCM
        const fields_encrypted: EncryptedFields = encryptFields(
            fields as Record<string, string>,
        );

        const credential = await prisma.credential.create({
            data: {
                client_id: userId,
                type: type as CredentialType,
                name,
                service: service ?? null,
                environment: (environment as CredentialEnvironment) ?? 'production',
                // Prisma types Json columns as InputJsonValue; cast through unknown
                fields_encrypted: fields_encrypted as unknown as object,
            },
            select: {
                id: true,
                client_id: true,
                type: true,
                name: true,
                service: true,
                environment: true,
                added_at: true,
                last_used_at: true,
            },
        });

        return res.status(201).json({
            success: true,
            data: maskCredential(credential),
        });
    } catch (error: any) {
        console.error('[POST /credentials]', error);
        return res.status(500).json({ success: false, error: 'Failed to create credential.' });
    }
});

// ─────────────────────────────────────────────────────────────
// PATCH /api/v1/credentials/:id
// Updates a credential. Any provided fields are re-encrypted.
//
// Request body (all optional):
//  { name?, service?, environment?, fields?: { [fieldName: string]: string } }
// ─────────────────────────────────────────────────────────────
credentialsRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;
        const { name, service, environment, fields } = req.body;

        // Ownership check
        const existing = await prisma.credential.findFirst({
            where: { id, client_id: userId, deleted_at: null },
        });

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Credential not found.' });
        }

        const updateData: Record<string, unknown> = {};

        if (name !== undefined) updateData.name = name;
        if (service !== undefined) updateData.service = service;
        if (environment !== undefined) updateData.environment = environment as CredentialEnvironment;

        if (fields && typeof fields === 'object') {
            // Re-encrypt updated fields. Merge with existing encrypted fields:
            // existing encrypted fields remain, new keys overwrite or extend.
            const existingEncrypted = existing.fields_encrypted as unknown as EncryptedFields;
            const newEncrypted = encryptFields(fields as Record<string, string>);
            updateData.fields_encrypted = { ...existingEncrypted, ...newEncrypted } as unknown as object;
        }

        const updated = await prisma.credential.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                client_id: true,
                type: true,
                name: true,
                service: true,
                environment: true,
                added_at: true,
                last_used_at: true,
            },
        });

        return res.status(200).json({
            success: true,
            data: maskCredential(updated),
        });
    } catch (error: any) {
        console.error('[PATCH /credentials/:id]', error);
        return res.status(500).json({ success: false, error: 'Failed to update credential.' });
    }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/v1/credentials/:id
// Soft-deletes a credential by setting deleted_at. Data is kept for audit trail.
// ─────────────────────────────────────────────────────────────
credentialsRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;

        // Ownership check
        const existing = await prisma.credential.findFirst({
            where: { id, client_id: userId, deleted_at: null },
        });

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Credential not found.' });
        }

        await prisma.credential.update({
            where: { id },
            data: { deleted_at: new Date() },
        });

        return res.status(200).json({
            success: true,
            message: 'Credential deleted successfully.',
        });
    } catch (error: any) {
        console.error('[DELETE /credentials/:id]', error);
        return res.status(500).json({ success: false, error: 'Failed to delete credential.' });
    }
});

// ─────────────────────────────────────────────────────────────
// POST /api/v1/credentials/:id/reveal
// Decrypts and returns the credential's sensitive fields.
//
// ⚠️  SECURITY GATE (spec §7.1):
//   The caller MUST supply a valid view_token in the X-OTP-TOKEN header.
//   The view_token is issued by POST /api/v1/auth/verify-otp
//   with purpose = 'credential_reveal'. It is HMAC-signed, user-scoped,
//   and expires 5 minutes after issuance.
//
// Every successful reveal is written to `credentials_audit_log`.
// ─────────────────────────────────────────────────────────────
credentialsRouter.post('/:id/reveal', async (req: Request, res: Response) => {
    try {
        const userId = req.auth.userId;
        const { id } = req.params;

        // ── 1. Extract and validate the view_token ──────────────
        const viewToken = req.headers['x-otp-token'];

        if (!viewToken || typeof viewToken !== 'string') {
            return res.status(401).json({
                success: false,
                error: 'Missing X-OTP-TOKEN header. Complete OTP verification first.',
            });
        }

        try {
            validateViewToken(viewToken, userId, OtpPurpose.credential_reveal);
        } catch (tokenError: any) {
            return res.status(401).json({
                success: false,
                error: `OTP token invalid: ${tokenError.message}`,
            });
        }

        // ── 2. Fetch the credential (ownership enforced) ────────
        const credential = await prisma.credential.findFirst({
            where: { id, client_id: userId, deleted_at: null },
        });

        if (!credential) {
            return res.status(404).json({ success: false, error: 'Credential not found.' });
        }

        // ── 3. Decrypt fields ───────────────────────────────────
        let decryptedFields: Record<string, string>;
        try {
            decryptedFields = decryptFields(credential.fields_encrypted as unknown as EncryptedFields);
        } catch (decryptError: any) {
            console.error('[reveal] Decryption failed for credential', id, decryptError);
            return res.status(500).json({
                success: false,
                error: 'Failed to decrypt credential. The stored data may be corrupt.',
            });
        }

        // ── 4. Update last_used_at ──────────────────────────────
        await prisma.credential.update({
            where: { id },
            data: { last_used_at: new Date() },
        });

        // ── 5. Audit log (spec §7.1) ────────────────────────────
        const ip =
            (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
            req.socket.remoteAddress ??
            null;

        await prisma.credentialAuditLog.create({
            data: {
                credential_id: id,
                user_id: userId,
                ip_address: ip,
            },
        });

        // ── 6. Return decrypted values ──────────────────────────
        return res.status(200).json({
            success: true,
            data: {
                id: credential.id,
                type: credential.type,
                name: credential.name,
                service: credential.service,
                environment: credential.environment,
                fields: decryptedFields,
            },
        });
    } catch (error: any) {
        console.error('[POST /credentials/:id/reveal]', error);
        return res.status(500).json({ success: false, error: 'Failed to reveal credential.' });
    }
});
