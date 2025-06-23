const JOI = require('joi');

const topupSchema = JOI.object({
    amount: JOI.number().integer()
        .min(1000)
        .required()
        .messages({
            'number.base': 'Jumlah harus berupa angka',
            'number.integer': 'Jumlah harus berupa bilangan bulat',
            'number.min': 'Jumlah minimal adalah 1000',
            'any.required': 'Jumlah wajib diisi'
        }),
    total_price: JOI.number().integer()
        .min(1000)
        .required()
        .messages({
            'number.base': 'Total harga harus berupa angka',
            'number.integer': 'Total harga harus berupa bilangan bulat',
            'number.min': 'Total harga minimal adalah 1000',
            'any.required': 'Total harga wajib diisi'
        }),
    payment_method: JOI.string()
        .required()
        .messages({
            'string.base': 'Metode pembayaran harus berupa string',
            'any.required': 'Metode pembayaran wajib diisi'
        })

});

module.exports = {
    topupSchema
};