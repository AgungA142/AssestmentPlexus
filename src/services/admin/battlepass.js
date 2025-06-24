const { battlepass, sequelize } = require('../../models');
const { BaseError, NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { createBattlepassSchema, updateBattlepassSchema } = require('../../common/validations/battlepass/battlepass');


/**
 * membuat battlepass baru
 * @param {Object} body - Data request untuk membuat battlepass baru
 * @returns {Promise<Object>} - Data battlepass yang berhasil dibuat
 * @throws {BaseError} - Jika terjadi kesalahan saat membuat battlepass * 
 */

const createBattlepass = async (body) => {
    const { error } = createBattlepassSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Buat battlepass baru
        const newBattlepass = await battlepass.create({
            ...body
        }, { transaction: t });

        await t.commit();
        return newBattlepass;
    } catch (error) {

        await t.rollback();

        if (error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Mengupdate battlepass yang sudah ada
 * @param {string} id - ID battlepass yang ingin diupdate
 * @param {Object} body - Data request untuk mengupdate battlepass
 * @returns {Promise<Object>} - Data battlepass yang berhasil diupdate
 * @throws {NotFoundError} - Jika battlepass tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat mengupdate battlepass
 */

const updateBattlepass = async (id, body) => {
    const { error } = updateBattlepassSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Cek apakah battlepass dengan ID tersebut ada
        const battlepassData = await battlepass.findByPk(id, { transaction: t });

        if (!battlepassData) {
            throw new NotFoundError('Battlepass tidak ditemukan');
        }

        // Update battlepass
        const updatedBattlepass = await battlepassData.update(body, { transaction: t });

        await t.commit();
        return updatedBattlepass;
    } catch (error) {
        await t.rollback();

        if (error instanceof NotFoundError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Menghapus battlepass yang sudah ada
 * @param {string} id - ID battlepass yang ingin dihapus
 * @returns {Promise<void>} - Tidak mengembalikan data apapun
 * @throws {NotFoundError} - Jika battlepass tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat menghapus battlepass
 */

const deleteBattlepass = async (id) => {
    const t = await sequelize.transaction();
    try {
        // Cek apakah battlepass dengan ID tersebut ada
        const battlepassData = await battlepass.findByPk(id, { transaction: t });

        if (!battlepassData) {
            throw new NotFoundError('Battlepass tidak ditemukan');
        }

        // Hapus battlepass
        await battlepassData.destroy({ transaction: t });

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
    createBattlepass,
    updateBattlepass,
    deleteBattlepass
};
