const { user, role } = require('../../models');
const { encryptPassword } = require('../../common/utils/encrypt');
const { BaseError,NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { registerSchema } = require('../../common/validations/auth/auth');
const { StatusCodes } = require('http-status-codes');

/**
 * Fungsi untuk mendaftarkan pengguna baru
 * @param {Object} body - Data pengguna yang akan didaftarkan
 * @returns {Promise<Object>} - Data pengguna yang sudah didaftarkan
 * @throws {NotFoundError} - Jika role tidak ditemukan
 * @throws {ConflictError} - Jika email sudah terdaftar
 * @throws {BaseError} - Jika terjadi kesalahan saat proses pendaftaran
 */
const register = async (body) => {
    try {
    // Validasi input menggunakan schema JOI
    const { error } = registerSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const { email, password, role_name } = body;

    // Cek apakah role ada
    const roleData = await role.findOne({ where: { name: role_name } });
    if (!roleData) {
        throw new NotFoundError('Role tidak ditemukan');
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
        throw new ConflictError('Email sudah terdaftar');
    }

    // Enkripsi password
    const hashedPassword = await encryptPassword(password);

    // Simpan pengguna baru
    const newUser = await user.create({
        email,
        password: hashedPassword,
        role_id: roleData.id,
    });

    return newUser;
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof ConflictError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, 'Terjadi kesalahan saat mendaftar: ' + error.message);
    }
}

module.exports = {
    register,
};


