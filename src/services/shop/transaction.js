const { shop, shop_item, item, profile, inventory, transaction, sequelize } = require('../../models');
const { BaseError, NotFoundError } = require('../../common/responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { topupSchema } = require('../../common/validations/shop/transaction');
const { simulatePaymentGateway } = require('../../common/utils/payment');
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
    const t = await sequelize.transaction();
    try {
        // Cek apakah shop ada
        console.log(shop_id);
        const shopData = await shop.findByPk(shop_id, { t });
        if (!shopData) {
            throw new NotFoundError('Shop tidak ditemukan');
        }

        // Cek apakah item ada
        console.log(item_id);
        const itemData = await item.findByPk(item_id, { t });
        if (!itemData) {
            throw new NotFoundError('Item tidak ditemukan');
        }

        // Cek apakah profil ada
        console.log(profile_id);
        const profileData = await profile.findByPk(profile_id, { t });
        if (!profileData) {
            throw new NotFoundError('Profil tidak ditemukan');
        }

        // Cek apakah item tersedia di shop
        const shopItem = await shop_item.findOne({
            where: { shop_id, item_id },
            t
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
                t 
            }
        );

        // Update stock di shop_item
        await shop_item.update(
            { stock: shopItem.stock - quantity },
            {
                where: { shop_id, item_id },
                t
            }
        );

        // Tambahkan item ke inventory profil
        const inventoryItem = await inventory.findOne({
            where: { profile_id, item_id },
            t
        });

        if (inventoryItem) {
            // Jika item sudah ada di inventory, tambahkan kuantitasnya
            await inventory.update(
                { quantity: inventoryItem.quantity + quantity },
                { 
                    where: { id: inventoryItem.id },
                    t 
                }
            );
        } else {
            // Jika item belum ada di inventory, buat entri baru
            await inventory.create({
                profile_id,
                item_id,
                quantity,
                acquired_at: new Date()
            }, { t });
        }

        await t.commit();

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

        await t.rollback();
        
        if (error instanceof NotFoundError || error instanceof BaseError) {
            throw error;
        }
        
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, `Terjadi kesalahan saat melakukan pembelian: ${error.message}`);
    }
};


/**
 * Fungsi untuk melakukan top-up game currency user
 * @param {string} user_id - ID user yang akan melakukan top-up
 * @param {Object} body - Data top-up yang berisi amount
 * @returns {Promise<Object>} - Data hasil top-up
 * @throws {NotFoundError} - Jika profile tidak ditemukan
 * @throws {BaseError} - Jika terjadi kesalahan saat melakukan top-up
 */

const topUpGameCurrency = async (user_id, body) => {
    const { error } = topupSchema.validate(body);
    if (error) {
        throw new BaseError(StatusCodes.BAD_REQUEST, `Data top-up tidak valid: ${error.message}`);
    }
    const { amount, payment_method, total_price } = body;
    const t = await sequelize.transaction();
    try {
        // Cek apakah profil ada dengan row level lock untuk mencegah race condition
        const profileData = await profile.findOne({
            where: { user_id },
            lock: t.LOCK.UPDATE,
            transaction: t
        });

        if (!profileData) {
            throw new NotFoundError('Profil tidak ditemukan');
        }

        const profile_id = profileData.id;
        const order_id = `TOPUP-${Date.now()}-${profile_id}`;
        // Buat transaksi top-up
        const newTransaction = await transaction.create({
            profile_id,
            order_id,
            amount,
            total_price,
            status: 'pending',
            payment_method
        }, { transaction: t });

        // Simulasi payment gateway
        const paymentResult = await simulatePaymentGateway(amount, payment_method);
        if (!paymentResult.success) {
            await transaction.update(
                { status: 'failed' },
                { where: { id: newTransaction.id }, transaction: t }
            );

            await t.commit();

            return {
                status: 'failed',
                order_id: newTransaction.order_id,
                username: profileData.username,
                payment_method: newTransaction.payment_method,
                amount: newTransaction.amount,
                total_price: newTransaction.total_price,
            };
        }

        // Update saldo game currency
        await profile.increment('game_currency', {
            by: amount,
            where: { id: profile_id },
            transaction: t
        });

        // Update status transaksi menjadi completed
        await transaction.update(
            { status: 'completed' },
            { where: { id: newTransaction.id }, transaction: t }
        );

        await t.commit();

        return {
            status: 'success',
            order_id: newTransaction.order_id,
            username: profileData.username,
            payment_method: newTransaction.payment_method,
            amount: newTransaction.amount,
            total_price: newTransaction.total_price,
            newBalance: profileData.game_currency + amount
        };
    } catch (error) {
        await t.rollback();

        if (error instanceof NotFoundError || error instanceof BaseError) {
            throw error;
        }

        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, `Terjadi kesalahan saat melakukan top-up: ${error.message}`);
    }
}

module.exports = {
    purchaseItem,
    topUpGameCurrency
};