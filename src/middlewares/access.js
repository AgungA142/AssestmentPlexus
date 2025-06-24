const { user, role } = require('../models');
const { StatusCodes } = require('http-status-codes');

const checkRole = (accessRole) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const userData = await user.findOne({
                where: { id: userId },
                include: [{ model: role, as: 'role' }]
            });
            if (!userData) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status: StatusCodes.UNAUTHORIZED,
                    message: 'Pengguna tidak ditemukan atau tidak terautentikasi.'
                });
            }
            const userRole = userData.role.name;
            if (!accessRole.includes(userRole)) {
                return res.status(StatusCodes.FORBIDDEN).json({
                    status: StatusCodes.FORBIDDEN,
                    message: 'Akses ditolak. Role tidak memiliki izin yang cukup.'
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
    checkRole
};