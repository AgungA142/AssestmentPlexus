const jwt = require('jsonwebtoken');
const { BaseError } = require('../responses/error-response');
const { StatusCodes } = require('http-status-codes');
const { JWT_SECRET } = process.env;

/**
 * Generate token JWT
 * @param {Object} payload - data yang akan dimasukkan ke dalam token
 * @param {string} secret - secret key dari env
 * @param {number} expiresIn - masa berlaku token, default 12 jam
 * @returns {string} - token JWT yang sudah di generate
 * @throws {BaseError} - jika terjadi kesalahan saat generate token
 */

const generateToken = (payload, secret = JWT_SECRET, expiresIn = '12h') => {
     try {
        return jwt.sign(payload, secret, { expiresIn });
     } catch (error) {
        throw new BaseError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error generating jwt token : ' + error.message);
     }
    }
/**
 * verifikasi token JWT menggunakan secret key
 * @param {string} token - token jwt untuk diverifikasi
 * @param {string} secret  - secret jey dari env
 * @returns {Object} - payload yang sudah di decode
 * @throws {BaseError} - jika token tidak valid
 */

const verifyToken = (token, secret = JWT_SECRET) => {
    try {
        const decoded = jwt.verify(token, secret);
        //cek apakah token sudah expired
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            throw new BaseError(StatusCodes.UNAUTHORIZED, 'Token sudah kadaluarsa');
        }
        return decoded;
    } catch (error) {
        return BaseError( StatusCodes.INTERNAL_SERVER_ERROR +'Error saat verifikasi Token : ' + error.message);
    }
}

/**
 * Decode token JWT tanpa memverifikasi signature dari secret key
 * @param {string} token - token JWT yang akan di decode
 * @returns {Object} - payload yang sudah di decode
 * @throws {BaseError} - jika terjadi kesalahan saat decode token
 */
const decodeToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (!decoded) {
            throw new BaseError(StatusCodes.UNAUTHORIZED, 'Token tidak valid');
        }
        return decoded;
    } catch (error) {
        throw new Error('Error decoding token' + error.message);
    }
}

module.exports = {
    generateToken,
    verifyToken,
    decodeToken,
};