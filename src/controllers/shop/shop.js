const { StatusCodes } = require('http-status-codes');
const { BaseError, ConflictError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { getAllShops, getShopById } = require('../../services/shop/shop');
const { purchaseItem, topUpGameCurrency } = require('../../services/shop/transaction');
const { createShop, updateShop, deleteShop } = require('../../services/admin/shop');
const { profile } = require('../../models');

const getAllShopsController = async (req, res, next) => {
    try {
        const result = await getAllShops();
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Daftar shop berhasil diambil',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const getShopByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await getShopById(id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Shop berhasil diambil',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const purchaseItemController = async (req, res, next) => {
    try {
        const { shop_id, item_id } = req.params;
        const { quantity } = req.body;
        const user_id = req.user.id;
        // const profileUser = await profile.findOne({ where: { user_id } });
        // if (!profileUser) {
        //     throw new ConflictError('Profil tidak ditemukan');
        // }
        // const profile_id = profileUser.id;
        const result = await purchaseItem(shop_id, item_id, user_id, quantity);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Pembelian berhasil',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const topUpGameCurrencyController = async (req, res, next) => {
    try {
        const body = req.body;
        const user_id = req.user.id;
        const result = await topUpGameCurrency(user_id, body);
        if(result.status === 'failed') {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
            new BaseResponse({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: result.message,
                data: result
            })
        );
        }
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Top up berhasil',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const createShopController = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await createShop(body);
        res.status(StatusCodes.CREATED).json(
            new BaseResponse({
                status: StatusCodes.CREATED,
                message: 'Shop berhasil dibuat',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const updateShopController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const result = await updateShop(id, body);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Shop berhasil diupdate',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const deleteShopController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteShop(id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Shop berhasil dihapus'
            })
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllShopsController,
    getShopByIdController,
    purchaseItemController,
    topUpGameCurrencyController,
    createShopController,
    updateShopController,
    deleteShopController
};