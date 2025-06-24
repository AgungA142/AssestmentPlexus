const { shop, sequelize } = require('../../models');
const { BaseError, NotFoundError, ConflictError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { createShopSchema, updateShopSchema } = require('../../common/validations/shop/shop');

/**
 * Membuat shop baru
 * @param {Object} body - Data request untuk membuat shop baru
 * @returns {Promise<Object>} - Data shop yang berhasil dibuat
 * @throws {BaseError} - Jika terjadi kesalahan saat membuat shop
 */

const createShop = async (body) => {
    const { error } = createShopSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Buat shop baru
        const newShop = await shop.create({
            ...body
        }, { transaction: t });

        await t.commit();
        return newShop;
    } catch (error) {
        await t.rollback();

        if (error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Mengupdate shop yang sudah ada
 * @param {string} id - ID shop yang ingin diupdate
 * @param {Object} body - Data request untuk mengupdate shop
 * @returns {Promise<Object>} - Data shop yang berhasil diupdate
 * @throws {NotFoundError} - Jika shop tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat mengupdate shop
 */

const updateShop = async (id, body) => {
    const { error } = updateShopSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, error.details[0].message);
    }
    const t = await sequelize.transaction();
    try {
        // Cek apakah shop dengan ID tersebut ada
        const shopData = await shop.findByPk(id, { transaction: t });

        if (!shopData) {
            throw new NotFoundError('Shop tidak ditemukan');
        }

        // Update shop
        const updatedShop = await shopData.update(body, { transaction: t });

        await t.commit();
        return updatedShop;
    } catch (error) {
        await t.rollback();

        if (error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Menghapus shop yang sudah ada
 * @param {string} id - ID shop yang ingin dihapus
 * @returns {Promise<void>} - Tidak mengembalikan apa pun jika berhasil
 * @throws {NotFoundError} - Jika shop tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat menghapus shop
 */

const deleteShop = async (id) => {
    const t = await sequelize.transaction();
    try {
        // Cek apakah shop dengan ID tersebut ada
        const shopData = await shop.findByPk(id, { transaction: t });

        if (!shopData) {
            throw new NotFoundError('Shop tidak ditemukan');
        }

        // Hapus shop
        await shopData.destroy({ transaction: t });

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
    createShop,
    updateShop,
    deleteShop
};