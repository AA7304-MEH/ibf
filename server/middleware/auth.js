const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// For MVP, we use the loose requireAuth which populates req.auth
// We need to map req.auth.userId to our database user if needed, or just trust the token.
// However, our app logic relies on req.user.id being the Mongo _id.
// So we need a middleware that finds the Mongo user based on Clerk ID.

const User = require('../models/User');

const auth = async (req, res, next) => {
    // Use Clerk middleware to verify token (manually for control or use the wrapper)
    // Simplified for MVP: We stick to custom middleware that verifies the token using Clerk's method or just decoding if we trust the cloud.
    // Better: Use `ClerkExpressRequireAuth` then find user.

    // Since we are inside a function, let's use the SDK's verifyToken method or just decrypt.
    // Actually, easiest way with Express is to use the middleware provided by SDK.
    // But to keep our structure `app.use(auth)` same, let's adapt.

    // NOTE: This requires CLERK_SECRET_KEY in .env

    try {
        // Check for token in cookies
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

        // Verify token
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.user) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }

        const userId = decoded.user.id;

        // MOCK BYPASS (If DB is offline)
        if (userId === 'mock_admin_id') {
            req.user = { id: 'mock_admin_id', role: 'admin' };
            return next();
        }

        // Find user in Mongo
        const user = await User.findById(userId).catch(err => null);

        if (!user) {
            return res.status(401).json({ msg: 'User does not exist (DB Offline?)' });
        } else {
            req.user = { id: user.id, role: user.role };
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
