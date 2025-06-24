const { StatusCodes } = require('http-status-codes');
const { BaseError, ConflictError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { createQuest, updateQuest, deleteQuest } = require('../../services/admin/quest');

const createQuestController = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await createQuest(body);
        res.status(StatusCodes.CREATED).json(
            new BaseResponse({
                status: StatusCodes.CREATED,
                message: 'Quest berhasil dibuat',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const updateQuestController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const result = await updateQuest(id, body);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Quest berhasil diupdate',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const deleteQuestController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteQuest(id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Quest berhasil dihapus'
            })
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createQuestController,
    updateQuestController,
    deleteQuestController
};