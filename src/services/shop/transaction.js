const { shop, shop_item, item, profile, inventory, sequelize } = require('../../models');
const { BaseError, NotFoundError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');

/**
 * Membeli item dari shop.
 * @param {string} shop_id - ID dari shop tempat pembelian dilakukan.
 * @param {string} item_id - ID dari item yang ingin dibeli.
 * @param {string} profile_id - ID dari profil yang melakukan pembelian.
 * @param {number} quantity - Jumlah item yang ingin dibeli.
 * @returns {Promise<Object>} - Data transaksi yang berhasil.
 * @throws {NotFoundError} - Jika shop, item, atau profil tidak ditemukan.
 * @throws {BaseError} - Jika terjadi kesalahan saat melakukan pembelian.
 */

const purchaseItem = async (shop_id, item_id, profile_id, quantity) => {
    const transaction = await sequelize.transaction();
    try {
        // Cek apakah shop ada
        console.log(shop_id);
        const shopData = await shop.findByPk(shop_id, { transaction });
        if (!shopData) {
            throw new NotFoundError('Shop tidak ditemukan');
        }

        // Cek apakah item ada
        console.log(item_id);
        const itemData = await item.findByPk(item_id, { transaction });
        if (!itemData) {
            throw new NotFoundError('Item tidak ditemukan');
        }

        // Cek apakah profil ada
        console.log(profile_id);
        const profileData = await profile.findByPk(profile_id, { transaction });
        if (!profileData) {
            throw new NotFoundError('Profil tidak ditemukan');
        }

        // Cek apakah item tersedia di shop
        const shopItem = await shop_item.findOne({
            where: { shop_id, item_id },
            transaction
        });
        if (!shopItem) {
            throw new NotFoundError('Item tidak tersedia di shop ini');
        }


        // Cek stock
        if (shopItem.stock < quantity && shopItem.stock !== 0) {
            throw new BaseError(StatusCodes.BAD_REQUEST, 'Stock item tidak cukup untuk pembelian');
        }

        const totalPrice = shopItem.price * quantity;

        // Cek saldo profil
        if (profileData.game_currency < totalPrice) {
            throw new BaseError(StatusCodes.BAD_REQUEST, 'Saldo tidak cukup untuk melakukan pembelian');
        }

        // Update saldo profil (kurangi saldo)
        await profile.update(
            { game_currency: profileData.game_currency - totalPrice }, 
            { 
                where: { id: profile_id },
                transaction 
            }
        );

        // Update stock di shop_item
        await shop_item.update(
            { stock: shopItem.stock - quantity },
            {
                where: { shop_id, item_id },
                transaction
            }
        );

        // Tambahkan item ke inventory profil
        const inventoryItem = await inventory.findOne({
            where: { profile_id, item_id },
            transaction
        });

        if (inventoryItem) {
            // Jika item sudah ada di inventory, tambahkan kuantitasnya
            await inventory.update(
                { quantity: inventoryItem.quantity + quantity },
                { 
                    where: { id: inventoryItem.id },
                    transaction 
                }
            );
        } else {
            // Jika item belum ada di inventory, buat entri baru
            await inventory.create({
                profile_id,
                item_id,
                quantity,
                acquired_at: new Date()
            }, { transaction });
        }

        // Commit transaction jika semua operasi berhasil
        await transaction.commit();

        return {
            totalPrice,
            remainingCurrency: profileData.game_currency - totalPrice,
            purchasedItem: {
                itemId: itemData.id,
                itemName: itemData.name,
                quantity,
                Price: shopItem.price
            },
            shopInfo: {
                shopId: shopData.id,
                shopName: shopData.name
            }
        };

    } catch (error) {
        // Rollback transaction jika terjadi error
        await transaction.rollback();
        
        // Re-throw error yang sudah diketahui
        if (error instanceof NotFoundError || error instanceof BaseError) {
            throw error;
        }
        
        // Throw generic error untuk error yang tidak diketahui
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, `Terjadi kesalahan saat melakukan pembelian: ${error.message}`);
    }
};

module.exports = {
    purchaseItem
};