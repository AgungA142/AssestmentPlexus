const JOI = require('joi');

const createQuestSchema = JOI.object({
    title: JOI.string()
        .required()
        .messages({
            'string.empty': 'Judul quest tidak boleh kosong',
            'any.required': 'Judul quest harus diisi'
        }),
    description: JOI.string()
        .optional()
        .allow(''),
    quest_type: JOI.string()
        .valid('daily', 'weekly', 'monthly', 'battlepass')
        .required()
        .messages({
            'any.only': 'Tipe quest harus salah satu dari: daily, weekly, event',
            'any.required': 'Tipe quest harus diisi'
        }),
    objective: JOI.string()
        .required()
        .messages({
            'string.empty': 'Objektif quest tidak boleh kosong',
            'any.required': 'Objektif quest harus diisi'
        }),
    reward_type: JOI.string()
        .valid('game_currency', 'item')
        .required()
        .messages({
            'any.only': 'Tipe reward harus salah satu dari: game_currency, item',
            'any.required': 'Tipe reward harus diisi'
        }),
    reward_value: JOI.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'Nilai reward harus berupa angka',
            'number.integer': 'Nilai reward harus berupa bilangan bulat',
            'number.min': 'Nilai reward tidak boleh kurang dari 1',
            'any.required': 'Nilai reward harus diisi'
        }),
    reward_item_name: JOI.string()
        .optional()
        .allow(''),
})

const updateQuestSchema = createQuestSchema.fork(['title', 'description', 'quest_type', 'objective', 'reward_type', 'reward_value', 'reward_item_name'], (schema) => schema.optional());

module.exports = {
    createQuestSchema,
    updateQuestSchema
};