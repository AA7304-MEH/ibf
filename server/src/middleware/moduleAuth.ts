import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Middleware to enforce strict module isolation.
 * Checks if the user has permission to access the specific IBF module.
 */
export const moduleAuth = (requiredModule: 'incubator' | 'collab' | 'skillswap') => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Admin has access to all modules
        if (req.user.role === 'admin') {
            return next();
        }

        const hasAccess = req.user.moduleAccess && req.user.moduleAccess.includes(requiredModule);

        if (!hasAccess) {
            return res.status(403).json({
                message: `User does not have access to the ${requiredModule} module.`
            });
        }

        next();
    };
};
