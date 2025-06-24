const { StatusCodes } = require('http-status-codes');
const { BaseError, ConflictError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { createItem, updateItem, deleteItem } = require('../../services/admin/item');

const createItemController = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await createItem(body);
        res.status(StatusCodes.CREATED).json(
            new BaseResponse({
                status: StatusCodes.CREATED,
                message: 'Item berhasil dibuat',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const updateItemController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const result = await updateItem(id, body);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Item berhasil diupdate',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const deleteItemController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteItem(id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Item berhasil dihapus'
            })
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createItemController,
    updateItemController,
    deleteItemController
};