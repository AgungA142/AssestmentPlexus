const { StatusCodes } = require('http-status-codes');
const { BaseError, ConflictError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { getAllShops, getShopById } = require('../../services/shop/shop');
const { purchaseItem } = require('../../services/shop/transaction');
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
        const profileUser = await profile.findOne({ where: { user_id } });
        if (!profileUser) {
            throw new ConflictError('Profil tidak ditemukan');
        }
        const profile_id = profileUser.id;
        const result = await purchaseItem(shop_id, item_id, profile_id, quantity);
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

module.exports = {
    getAllShopsController,
    getShopByIdController,
    purchaseItemController
};