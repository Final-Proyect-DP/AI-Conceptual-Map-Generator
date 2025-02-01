const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const redisUtils = require('../utils/redisUtils');

const verifyToken = async (req, res, next) => {
    const { userId, token } = req.query;

    if (!token || !userId) {
        logger.warn(`Authentication failed: ${!token ? 'Missing token' : 'Missing userId'}`);
        return res.status(401).json({
            status: 'error',
            code: 'AUTH_MISSING_PARAMS',
            message: 'Authentication failed',
            details: {
                missing: !token ? 'token' : 'userId',
                received: { userId, token: token ? 'provided' : 'missing' }
            }
        });
    }

    try {
        // Verificar JWT
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        logger.info(`JWT verification successful for user ${userId}`);
        
        // Verificar token en Redis
        const storedToken = await redisUtils.getToken(userId);
        
        if (!storedToken || storedToken !== token) {
            logger.warn(`Redis token validation failed for user ${userId}`);
            return res.status(401).json({
                status: 'error',
                code: 'AUTH_INVALID_SESSION',
                message: 'Session validation failed',
                details: {
                    reason: !storedToken ? 'No active session found' : 'Token mismatch',
                    userId
                }
            });
        }

        logger.info(`Authentication successful for user ${userId}`);
        req.user = decoded;
        req.validatedToken = token;
        next();
    } catch (error) {
        logger.error(`JWT verification failed for user ${userId}:`, error);
        return res.status(401).json({
            status: 'error',
            code: 'AUTH_INVALID_TOKEN',
            message: 'Token verification failed',
            details: {
                error: error.message,
                userId
            }
        });
    }
};

module.exports = { verifyToken };
