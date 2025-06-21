const { user, profile } = require('../../models');
const { BaseError, NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { profileSchema } = require('../../common/validations/user/profile');

/**
 * Fungsi untuk mendapatkan profil user
 * @param {string} user_id - ID user
 * @returns {Promise<Object>} - Data profil user
 * @throws {NotFoundError} - Jika profil tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat mengambil profil
 */

const getProfile = async (user_id) => {
    try {
        const userData = await user.findByPk(user_id, {
            include: [{ model: profile, as: 'profile' }]
        });

        if (!userData || !userData.profile) {
            throw new NotFoundError(StatusCodes.NOT_FOUND, 'Profil tidak ditemukan');
        }

        return userData;
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan saat mengambil profil: ' + error.message);
    }
}

/**
 * Fungsi untuk membuat profil user
 * @param {string} user_id - ID user
 * @param {Object} body - Data profil user yang akan dibuat
 * @returns {Promise<Object>} - Data profil yang sudah diperbarui
 * @throws {NotFoundError} - Jika profil tidak ditemukan
 * @throws {ConflictError} - Jika profil sudah ada
 * @throws {BaseError} - Jika terjadi kesalahan saat memperbarui profil
 */

const createProfile = async (user_id, body) => {
    try {
        const { error } = profileSchema.validate(body);
        if (error) {
            throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
        }

        const { username } = body;

        const userData = await user.findByPk(user_id);
        if (!userData) {
            throw new NotFoundError(StatusCodes.NOT_FOUND, 'User tidak ditemukan');
        }

        const existingProfile = await profile.findOne({ where: { user_id } });
        if (existingProfile) {
            throw new ConflictError(StatusCodes.CONFLICT, 'Profil sudah ada');
        }

        const newProfile = await profile.create({
            user_id,
            username
        });

        return newProfile;
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ConflictError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan saat membuat profil: ' + error.message);
    }
}


module.exports = {
    getProfile,
    createProfile,
};

