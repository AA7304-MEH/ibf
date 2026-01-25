import { Request, Response, NextFunction } from 'express';

const BANNED_KEYWORDS = ['hack', 'exploit', 'ddos', 'malware', 'bypass', 'cheats'];

export const contentSafety = (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'POST' || req.method === 'PUT') {
        const bodyStr = JSON.stringify(req.body).toLowerCase();

        const found = BANNED_KEYWORDS.find(word => bodyStr.includes(word));
        if (found) {
            console.warn(`[SAFETY] Blocked content containing: ${found}`);
            return res.status(400).json({
                message: "Safety Alert: Your content contains restricted keywords. Please revise.",
                flagged: found
            });
        }
    }
    next();
};
