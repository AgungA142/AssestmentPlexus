const { StatusCodes } = require('http-status-codes');
const { BaseError } = require('../src/common/responses/error-response');

function notFound(req, res, next) {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
}

function errorHandler(err, req, res, next) {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong!';

    if (err instanceof BaseError) {
        statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        message = err.message || message;
    } else {
        console.error("Unhandled error:", err);
    }

    const response = {
        status: statusCode,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack }), // Extra info in development
    };

    // Send the error response
    res.status(statusCode).json(response);
}

module.exports = {
    notFound,
    errorHandler,
};
