const { StatusCodes } = require('http-status-codes');
const { BaseError, ConflictError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { getAvailableBattlepass, activateBattlepass, getActiveBattlepassQuests } = require('../../services/battlepass/battlepass');
const { createBattlepass, updateBattlepass, deleteBattlepass } = require('../../services/admin/battlepass');

const getAvailableBattlepassController = async (req, res, next) => {
    try {
        const result = await getAvailableBattlepass();
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Daftar battlepass berhasil diambil',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const activateBattlepassController = async (req, res, next) => {
    try {
        const { battlepass_id } = req.params;
        const user_id = req.user.id;
        const result = await activateBattlepass(user_id, battlepass_id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Battlepass berhasil diaktifkan',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const getActiveBattlepassQuestsController = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const result = await getActiveBattlepassQuests(user_id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Daftar quest aktif battlepass berhasil diambil',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const createBattlepassController = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await createBattlepass(body);
        res.status(StatusCodes.CREATED).json(
            new BaseResponse({
                status: StatusCodes.CREATED,
                message: 'Battlepass berhasil dibuat',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const updateBattlepassController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const result = await updateBattlepass(id, body);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Battlepass berhasil diupdate',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const deleteBattlepassController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteBattlepass(id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Battlepass berhasil dihapus'
            })
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAvailableBattlepassController,
    activateBattlepassController,
    getActiveBattlepassQuestsController,
    createBattlepassController,
    updateBattlepassController,
    deleteBattlepassController
};