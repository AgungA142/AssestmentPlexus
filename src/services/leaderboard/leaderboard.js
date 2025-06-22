const { profile } = require('../../models');
const { BaseError, NotFoundError} = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');

/**
 * mengambil data leaderboard berdasarkan skor user 
 * @param {Object} query - Objek yang berisi parameter untuk pagination filter dll.
 * @returns {Promise<Array>} - Daftar leaderboard yang berisi nama pengguna dan skor.
 * @throws {BaseError} - Jika terjadi kesalahan saat mengambil data leaderboard.
 */

const getLeaderboard = async (query) => {
    try {
        const { page = 1, limit = 10, n = 50 } = query;
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const offset = (pageNumber - 1) * limitNumber;
        const topN = parseInt(n);

        
        const leaderboardData = await profile.findAll({
            attributes: ['user_id','username', 'score'],
            order: [['score', 'DESC']],
            limit: topN,            
        });

        if (!leaderboardData || leaderboardData.length === 0) {
            throw new NotFoundError(StatusCodes.NOT_FOUND, 'Leaderboard tidak ditemukan');
        }

        
        const firstIndex = offset;
        const lastIndex = offset + limitNumber;
        const slicedData = leaderboardData.slice(firstIndex, lastIndex);
        const totalPages = Math.ceil(leaderboardData.length / limitNumber);
        

        const pagination = {
            currentPage: pageNumber,
            totalItems: leaderboardData.length,
            totalPages: totalPages,
            itemsPerPage: limitNumber,
            hasNextPage: pageNumber < totalPages,
            hasPreviousPage: pageNumber > 1,
            topN: topN
        };
        return {
            leaderboard: slicedData.map((item, index) => ({
                rank: firstIndex + index + 1,
                username: item.username,
                score: item.score
            })),
            pagination: pagination
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    getLeaderboard
};