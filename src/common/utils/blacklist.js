const { BaseError } = require('../responses/error-response');
const { StatusCodes } = require('http-status-codes');
const redisClient = require('../../config/redis');

/**
 * Fungsi untuk mengecek apakah token sudah di-blacklist
 * @param {string} token - Token JWT yang akan dicek
 * @returns {Promise<boolean>} - True jika token sudah di-blacklist
 */
const checkBlacklistedToken = async (token) => {
    try {
        const result = await redisClient.get(`blacklist:${token}`);
        return result === 'true';
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error checking token blacklist: ' + error.message);
    }
};

module.exports = {
    checkBlacklistedToken,
};