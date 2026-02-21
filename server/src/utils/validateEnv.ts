import { logger } from '../utils/logger';

const REQUIRED_ENV_VARS = [
    'MONGODB_URI',
    'PORT'
];

// Optional but recommended for features
const APP_ENV_VARS: string[] = [];

export const validateEnv = () => {
    const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

    if (missing.length > 0) {
        logger.error(`CRITICAL: Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }

    const missingOptional = APP_ENV_VARS.filter(key => !process.env[key]);
    if (missingOptional.length > 0) {
        logger.warn(`Missing optional environment variables (some features may be disabled): ${missingOptional.join(', ')}`);
    }

    logger.info('Environment variables validated.');
};
