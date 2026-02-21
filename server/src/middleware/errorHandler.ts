import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    logger.error(`[${req.method}] ${req.path} >> ${err.message}`);
    if (err.stack) {
        logger.debug(err.stack);
    }

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
