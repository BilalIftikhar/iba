/**
 * encryption.service.ts
 * AES-256-GCM encryption/decryption using Node's native `crypto` module.
 *
 * Security Model (IBA_Dashboard_Technical_Spec §7.1):
 *  - All credential values are encrypted at rest using AES-256-GCM.
 *  - The key is sourced from CREDENTIAL_ENCRYPTION_KEY env var (64-char hex = 32 bytes).
 *  - Every cipher operation uses a fresh random 128-bit IV.
 *  - GCM auth-tag (128 bit) guarantees ciphertext integrity.
 *  - The stored payload is: { iv, authTag, ciphertext } — all hex-encoded.
 */
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;  // 128-bit IV
const TAG_LENGTH = 16; // 128-bit auth tag

// ─────────────────────────────────────────────────────────────
// Core types
// ─────────────────────────────────────────────────────────────

export interface EncryptedPayload {
    iv: string;
    authTag: string;
    ciphertext: string;
}

/**
 * Shape of the `fields_encrypted` JSON column in the Credential model.
 * Sensitive fields are replaced with EncryptedPayload objects.
 * Non-sensitive fields (like `last_payload_at`) may live here as plain values.
 */
export type EncryptedFields = Record<string, EncryptedPayload>;

// ─────────────────────────────────────────────────────────────
// Core primitives
// ─────────────────────────────────────────────────────────────

/**
 * Encrypts a plain-text string using AES-256-GCM.
 * Returns an EncryptedPayload suitable for JSON storage.
 */
export const encrypt = (plaintext: string): EncryptedPayload => {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);

    return {
        iv: iv.toString('hex'),
        authTag: cipher.getAuthTag().toString('hex'),
        ciphertext: encrypted.toString('hex'),
    };
};

/**
 * Decrypts an EncryptedPayload produced by `encrypt()`.
 * Throws if the GCM auth tag validation fails (tampered / corrupt data).
 */
export const decrypt = (payload: EncryptedPayload): string => {
    const key = getKey();
    const iv = Buffer.from(payload.iv, 'hex');
    const authTag = Buffer.from(payload.authTag, 'hex');
    const ciphertext = Buffer.from(payload.ciphertext, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
};

// ─────────────────────────────────────────────────────────────
// Field-level helpers (for Credential.fields_encrypted)
// ─────────────────────────────────────────────────────────────

/**
 * Encrypts a map of { fieldName: plaintext } values.
 * Returns { fieldName: EncryptedPayload } suitable for storing in `fields_encrypted`.
 *
 * Example input:  { api_key: 'sk_live_...', secret_key: 'whsec_...' }
 * Example output: { api_key: { iv, authTag, ciphertext }, secret_key: { ... } }
 */
export const encryptFields = (fields: Record<string, string>): EncryptedFields => {
    const result: EncryptedFields = {};
    for (const [field, value] of Object.entries(fields)) {
        result[field] = encrypt(value);
    }
    return result;
};

/**
 * Decrypts all fields in an EncryptedFields object.
 * Returns a plain { fieldName: plaintextString } map.
 * Throws if any auth tag verification fails.
 */
export const decryptFields = (encryptedFields: EncryptedFields): Record<string, string> => {
    const result: Record<string, string> = {};
    for (const [field, payload] of Object.entries(encryptedFields)) {
        result[field] = decrypt(payload);
    }
    return result;
};

// ─────────────────────────────────────────────────────────────
// Internal
// ─────────────────────────────────────────────────────────────

const getKey = (): Buffer => {
    const hexKey = process.env.CREDENTIAL_ENCRYPTION_KEY;
    if (!hexKey || hexKey.length !== 64) {
        throw new Error(
            'CREDENTIAL_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)',
        );
    }
    return Buffer.from(hexKey, 'hex');
};
