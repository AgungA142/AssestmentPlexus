const { StatusCodes } = require('http-status-codes');
const { BaseError, ConflictError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { createRole, updateRole, deleteRole } = require('../../services/admin/role');

const createRoleController = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await createRole(body);
        res.status(StatusCodes.CREATED).json(
            new BaseResponse({
                status: StatusCodes.CREATED,
                message: 'Role berhasil dibuat',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const updateRoleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const result = await updateRole(id, body);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Role berhasil diupdate',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const deleteRoleController = async (req, res, next) => {
    try {
        const { id } = req.params;
        await deleteRole(id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Role berhasil dihapus'
            })
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createRoleController,
    updateRoleController,
    deleteRoleController
};