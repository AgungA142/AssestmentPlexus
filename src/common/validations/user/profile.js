const JOI = require('joi');

const profileSchema = JOI.object({
    username: JOI.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.min': 'Username harus memiliki minimal 3 karakter',
            'string.max': 'Username harus memiliki maksimal 30 karakter',
            'any.required': 'Username tidak boleh kosong',
        }),
})

module.exports = {
    profileSchema,
};