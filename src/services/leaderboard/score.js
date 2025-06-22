const { profile } = require('../../models');
const { BaseError, NotFoundError} = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { scoreSchema } = require('../../common/validations/user/score');


/**
 * Mengambil data skor user berdasarkan ID user.
 * @param {string} user_id - ID user yang ingin diambil skornya.
 * @returns {Promise<Object>} - Objek yang berisi ID user, nama user, dan skor.
 * @throws {BaseError} - Jika terjadi kesalahan saat mengambil data skor.
 */

const getScoreByUserId = async (user_id) => {
    try {
        const userScore = await profile.findOne({
            where: { user_id }
        });

        if (!userScore) {
            throw new NotFoundError(StatusCodes.NOT_FOUND, 'user tidak ditemukan');
        }

        return {
            user_id: userScore.user_id,
            username: userScore.username,
            score: userScore.score
        };
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Menyimpan data skor tertinggi user berdasarkan ID user.
 * @param {string} user_id - ID user yang ingin disimpan skornya.
 * @returns {Promise<Object>} - Objek yang berisi ID user, nama user, dan skor.
 * @throws {BaseError} - Jika terjadi kesalahan saat mengambil data skor.
 */
const saveHighestScoreByUserId = async (user_id, body) => {
    try {
        const { error } = scoreSchema.validate(body);
        if (error) {
            throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
        }

        const { score } = body;

        const userScore = await profile.findOne({
            where: { user_id }
        });

        if (!userScore) {
            throw new NotFoundError(StatusCodes.NOT_FOUND, 'user tidak ditemukan');
        }

        if (score > userScore.score) {
            userScore.score = score;
            await userScore.save();
            return {
                user_id: userScore.user_id,
                username: userScore.username,
                new_score: userScore.score
            };
        } else {
            return {
                user_id: userScore.user_id,
                username: userScore.username,
                highest_score: userScore.score,
                message: 'coba lagi, skor anda lebih rendah atau sama dari skor sebelumnya',
            };
        }

    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}


module.exports = {
    getScoreByUserId,
    saveHighestScoreByUserId
};