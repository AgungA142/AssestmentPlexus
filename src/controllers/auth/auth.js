const { StatusCodes } = require('http-status-codes');
const { BaseError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { register } = require('../../services/auth/register');
const { login } = require('../../services/auth/login');
const { logout } = require('../../services/auth/logout');



const registerController = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await register(body);
        res.status(StatusCodes.CREATED).json(
            new BaseResponse({
                status: StatusCodes.CREATED,
                message: 'User registered successfully',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}


const loginController = async (req, res, next) => {
    try {
        const body = req.body;
        const result = await login(body);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Login successful',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const logoutController = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new BaseError(StatusCodes.UNAUTHORIZED, 'Token is required');
        }
        await logout(token);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Logout successful'
            })
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    registerController,
    loginController,
    logoutController
};
