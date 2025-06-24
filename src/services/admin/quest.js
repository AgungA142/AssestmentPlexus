const {quest, sequelize } = require('../../models');
const { BaseError, NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { createQuestSchema, updateQuestSchema } = require('../../common/validations/quest/quest');

/**
 * Membuat quest baru
 * @param {Object} body - Data request untuk membuat quest baru
 * @returns {Promise<Object>} - Data quest yang berhasil dibuat
 * @throws {BaseError} - Jika terjadi kesalahan saat membuat quest
 */

const createQuest = async (body) => {
    const { error } = createQuestSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Buat quest baru
        const newQuest = await quest.create({
            ...body
        }, { transaction: t });

        await t.commit();
        return newQuest;
    } catch (error) {
        await t.rollback();

        if (error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Mengupdate quest yang sudah ada
 * @param {string} id - ID quest yang ingin diupdate
 * @param {Object} body - Data request untuk mengupdate quest
 * @returns {Promise<Object>} - Data quest yang berhasil diupdate
 * @throws {NotFoundError} - Jika quest tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat mengupdate quest
 */

const updateQuest = async (id, body) => {
    const { error } = updateQuestSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Cek apakah quest dengan ID tersebut ada
        const questData = await quest.findByPk(id, { transaction: t });

        if (!questData) {
            throw new NotFoundError('Quest tidak ditemukan');
        }

        // Update quest
        const updatedQuest = await questData.update(body, { transaction: t });

        await t.commit();
        return updatedQuest;
    } catch (error) {
        await t.rollback();

        if (error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Menghapus quest yang sudah ada
 * @param {string} id - ID quest yang ingin dihapus
 * @returns {Promise<void>} - Tidak ada nilai yang dikembalikan jika berhasil
 * @throws {NotFoundError} - Jika quest tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat menghapus quest
 */

const deleteQuest = async (id) => {
    const t = await sequelize.transaction();
    try {
        // Cek apakah quest dengan ID tersebut ada
        const questData = await quest.findByPk(id, { transaction: t });

        if (!questData) {
            throw new NotFoundError('Quest tidak ditemukan');
        }

        // Hapus quest
        await questData.destroy({ transaction: t });

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
    createQuest,
    updateQuest,
    deleteQuest
};