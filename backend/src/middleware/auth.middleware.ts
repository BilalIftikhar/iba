import { Record } from '@prisma/client/runtime/library';
import { ClerkExpressRequireAuth, StrictAuthProp } from '@clerk/clerk-sdk-node';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request globally
declare global {
    namespace Express {
        interface Request extends StrictAuthProp { }
    }
}

// Ensure the Clerk authentication middleware can be reused via our standard `authenticate` export
export const authenticate = ClerkExpressRequireAuth();
