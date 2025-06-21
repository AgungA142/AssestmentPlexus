const { StatusCodes } = require('http-status-codes');
const { BaseError } = require('../../common/responses/error-response');
const BaseResponse = require('../../common/responses/base-response');
const { getLeaderboard } = require('../../services/leaderboard/leaderboard');
const { getScoreByUserId, saveHighestScoreByUserId } = require('../../services/leaderboard/score');

const getLeaderboardController = async (req, res, next) => {
    try {
        const query = req.query;
        const result = await getLeaderboard(query);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Leaderboard retrieved successfully',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const getScoreByUserIdController = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const result = await getScoreByUserId(user_id);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'Score retrieved successfully',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

const saveHighestScoreByUserIdController = async (req, res, next) => {
    try {
        const user_id = req.user.id; 
        const body = req.body;
        const result = await saveHighestScoreByUserId(user_id, body);
        res.status(StatusCodes.OK).json(
            new BaseResponse({
                status: StatusCodes.OK,
                message: 'berikut skor tertinggi anda ',
                data: result
            })
        );
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getLeaderboardController,
    getScoreByUserIdController,
    saveHighestScoreByUserIdController
};