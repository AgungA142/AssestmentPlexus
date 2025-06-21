const { user, role } = require('../../models');
const { BaseError,NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { comparePassword } = require('../../common/utils/encrypt');
const { loginSchema } = require('../../common/validations/auth/auth');
const { generateToken } = require('../../common/utils/jwt');
/**
 * Fungsi untuk melakukan login pengguna
 * @param {Object} body - Data login pengguna
 * @returns {Promise<Object>} - Data pengguna yang sudah login beserta token JWT
 * @throws {NotFoundError} - Jika email tidak ditemukan
 * @throws {ConflictError} - Jika email sudah terdaftar
 * @throws {BaseError} - Jika terjadi kesalahan saat proses login
 */

const login = async (body) => {
    try {
        // Validasi input menggunakan schema JOI
        const { error } = loginSchema.validate(body);
        if (error) {
            throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
        }

        const { email, password } = body;

        // Cek apakah email ada
        const userData = await user.findOne({
            where: { email },
            include: [
                { 
                    model: role,
                    as: 'role'
                }
            ]
        });
        if (!userData) {
            throw new NotFoundError(StatusCodes.NOT_FOUND, 'Email tidak ditemukan');
        }

        // Cek apakah password cocok
        const isPasswordValid = await comparePassword(password, userData.password);
        if (!isPasswordValid) {
            throw new ConflictError(StatusCodes.UNAUTHORIZED, 'Password salah');
        }

        // Generate token JWT
        const token = generateToken({ id: userData.id, role_name: userData.role.name });

        return {
            user:{
                id: userData.id,
                email: userData.email,
                role: userData.role.name,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
            },
            token,
        };
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ConflictError || error instanceof BaseError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan saat login: ' + error.message);
    }
}
module.exports = {
    login,
};