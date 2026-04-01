import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            auth: {
                userId: string;
                [key: string]: any;
            };
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_for_development';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    if (req.path.match(/\/api\/v1\/auth\/(login|signup|refresh|google|google\/callback)/)) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.auth = { userId: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token expired or invalid' });
    }
};
