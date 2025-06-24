const { role, sequelize } = require('../../models');
const { BaseError, NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { createRoleSchema, updateRoleSchema } = require('../../common/validations/role/role');

/**
 * Membuat role baru
 * @param {Object} body - Data request untuk membuat role baru
 * @returns {Promise<Object>} - Data role yang berhasil dibuat
 * @throws {BaseError} - Jika terjadi kesalahan saat membuat role
 */

const createRole = async (body) => {
    const { error } = createRoleSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Buat role baru
        const newRole = await role.create({
            ...body
        }, { transaction: t });

        await t.commit();
        return newRole;
    } catch (error) {
        await t.rollback();

        if (error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Mengupdate role yang sudah ada
 * @param {string} id - ID role yang ingin diupdate
 * @param {Object} body - Data request untuk mengupdate role
 * @returns {Promise<Object>} - Data role yang berhasil diupdate
 * @throws {NotFoundError} - Jika role tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat mengupdate role
 */

const updateRole = async (id, body) => {
    const { error } = updateRoleSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Cek apakah role dengan ID tersebut ada
        const roleData = await role.findByPk(id, { transaction: t });

        if (!roleData) {
            throw new NotFoundError('Role tidak ditemukan');
        }

        // Update role
        const updatedRole = await roleData.update(body, {transaction: t});

        await t.commit();
        return updatedRole;
    } catch (error) {
        await t.rollback();

        if (error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Menghapus role yang sudah ada
 * @param {string} id - ID role yang ingin dihapus
 * @returns {Promise<void>} - Tidak ada data yang dikembalikan
 * @throws {NotFoundError} - Jika role tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat menghapus role
 */

const deleteRole = async (id) => {
    const t = await sequelize.transaction();
    try {
        // Cek apakah role dengan ID tersebut ada
        const roleData = await role.findByPk(id, { transaction: t });

        if (!roleData) {
            throw new NotFoundError('Role tidak ditemukan');
        }

        // Hapus role
        await role.destroy({
            where: { id },
            transaction: t
        });

        await t.commit();
    } catch (error) {
        await t.rollback();

        if (error instanceof NotFoundError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    createRole,
    updateRole,
    deleteRole
};