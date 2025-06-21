const { BaseError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { verifyToken } = require('../../common/utils/jwt');
const redisClient = require('../../config/redis');

/**
 * logout user dengan memblacklist token di Redis
 * @param {string} token - token yang akan di blacklist
 * @returns {Promise<void>} - Promise yang menyelesaikan ketika token berhasil di blacklist
 * @throws {BaseError} - jika token tidak valid atau terjadi kesalahan saat memblacklist token
 */

async function logout(token) {
    if (!token) {
        throw new BaseError(StatusCodes.UNAUTHORIZED, 'Token is required');
    }

    try {
        // Verifikasi token
        const decoded = verifyToken(token);
        if (!decoded) {
            throw new BaseError(StatusCodes.UNAUTHORIZED, 'Invalid token');
        }

        // Blacklist token di Redis
        const expiryTime = decoded.exp - Math.floor(Date.now() / 1000);
        await redisClient.setEx(`blacklist:${token}`, expiryTime, 'true');

        return;
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, 'terjadi kesalahan : ' + error.message);
    }
}

module.exports = {
    logout,
};