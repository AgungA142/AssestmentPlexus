const { BaseError } = require('../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { verifyToken } = require('../common/utils/jwt');
const { checkBlacklistedToken } = require('../common/utils/blacklist');

/**
 * Middleware untuk otorisasi pengguna
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */

const authorizationMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new BaseError(StatusCodes.UNAUTHORIZED, 'Token is required');
        }

        const isBlacklisted = await checkBlacklistedToken(token);
        if (isBlacklisted) {
            throw new BaseError(StatusCodes.UNAUTHORIZED, 'Token has been blacklisted');
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            throw new BaseError(StatusCodes.UNAUTHORIZED, 'Invalid token');
        }

        req.user = decoded;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    authorizationMiddleware,
};