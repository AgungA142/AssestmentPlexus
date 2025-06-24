const {item, sequelize} = require('../../models');
const { BaseError, NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { createItemSchema, updateItemSchema } = require('../../common/validations/item/item');

/**
 * Membuat item baru
 * @param {Object} body - Data request untuk membuat item baru
 * @returns {Promise<Object>} - Data item yang berhasil dibuat
 * @throws {BaseError} - Jika terjadi kesalahan saat membuat item
 */
const createItem = async (body) => {
    const { error } = createItemSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Buat item baru
        const newItem = await item.create({
            ...body
        }, { transaction: t });

        await t.commit();
        return newItem;
    } catch (error) {
        await t.rollback();

        if (error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Mengupdate item yang sudah ada
 * @param {string} id - ID item yang ingin diupdate
 * @param {Object} body - Data request untuk mengupdate item
 * @returns {Promise<Object>} - Data item yang berhasil diupdate
 * @throws {NotFoundError} - Jika item tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat mengupdate item
 */

const updateItem = async (id, body) => {
    const { error } = updateItemSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Cek apakah item dengan ID tersebut ada
        const itemData = await item.findByPk(id, { transaction: t });

        if (!itemData) {
            throw new NotFoundError('Item tidak ditemukan');
        }

        // Update item
        const updatedItem = await itemData.update(body, { transaction: t });

        await t.commit();
        return updatedItem;
    } catch (error) {
        await t.rollback();

        if (error instanceof NotFoundError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Menghapus item yang sudah ada
 * @param {string} id - ID item yang ingin dihapus
 * @returns {Promise<void>} - Tidak ada data yang dikembalikan
 * @throws {NotFoundError} - Jika item tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat menghapus item
 */

const deleteItem = async (id) => {
    const t = await sequelize.transaction();
    try {
        // Cek apakah item dengan ID tersebut ada
        const itemData = await item.findByPk(id, { transaction: t });

        if (!itemData) {
            throw new NotFoundError('Item tidak ditemukan');
        }

        // Hapus item
        await itemData.destroy({ transaction: t });

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
    createItem,
    updateItem,
    deleteItem
};