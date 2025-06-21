const JOI = require('joi');

const scoreSchema = JOI.object({
    score: JOI.number()
        .integer()
        .min(0)
        .required()
        .messages({
            'number.base': 'Skor harus berupa angka',
            'number.integer': 'Skor harus berupa bilangan bulat',
            'number.min': 'Skor tidak boleh kurang dari 0',
            'any.required': 'Skor tidak boleh kosong',
        }),
}).required();

module.exports = {
    scoreSchema
};