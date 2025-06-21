const { StatusCodes } = require('http-status-codes');
const { BaseError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { getProfile, createProfile } = require('../../services/user/profile');

const getProfileController = async (req, res, next) => {
    try {
        const user_id = req.user.id; // Mengambil user_id dari token yang sudah diverifikasi
        const result = await getProfile(user_id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Profil retrieved successfully',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const createProfileController = async (req, res, next) => {
    try {
        const user_id = req.user.id; // Mengambil user_id dari token yang sudah diverifikasi
        const body = req.body;
        const result = await createProfile(user_id, body);
        res.status(StatusCodes.CREATED).json(
            new BaseResponse({
                status: StatusCodes.CREATED,
                message: 'Profil created successfully',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProfileController,
    createProfileController
};