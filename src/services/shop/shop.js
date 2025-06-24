const { shop, shop_item, item } = require('../../models');
const { BaseError, NotFoundError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');

/**
 * Mengambil daftar semua shop yang ada.
 * @returns {Promise<Array>} - Daftar shop yang ada.
 * @throws {BaseError} - Jika terjadi kesalahan saat mengambil data shop.
 */
const getAllShops = async () => {
    try {
        const shops = await shop.findAll();
        return shops;
    } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

/**
 * Mengambil data shop berdasarkan ID.
 * @param {string} id - ID dari shop yang ingin diambil.
 * @returns {Promise<Object>} - Data shop yang ditemukan.
 * @throws {NotFoundError} - Jika shop dengan ID tersebut tidak ditemukan.
 * @throws {BaseError} - Jika terjadi kesalahan saat mengambil data shop.
 */

const getShopById = async (id) => {
    try {
        const shopData = await shop.findByPk(id, {
            include: [
                {
                    model: shop_item,
                    as: 'shop_items',
                    include: [
                        {
                            model: item,
                            as: 'item'
                        }
                    ]
                }
            ]
        });

        if (!shopData) {
            throw new NotFoundError('Shop tidak ditemukan');
        }

        return shopData;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = {
    getAllShops,
    getShopById
};