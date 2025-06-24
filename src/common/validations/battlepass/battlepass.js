const JOI = require('joi');

const createBattlepassSchema = JOI.object({
  name: JOI.string()
    .required()
    .messages({
      'string.empty': 'Nama battlepass tidak boleh kosong',
      'any.required': 'Nama battlepass harus diisi'
    }),
  description: JOI.string()
    .optional()
    .allow(''),
    start_date: JOI.date()
    .required()
    .messages({
        'date.base': 'Tanggal mulai harus berupa tanggal yang valid',
        'any.required': 'Tanggal mulai harus diisi'
        }),
    end_date: JOI.date()
    .required()
    .greater(JOI.ref('start_date'))
    .messages({
        'date.base': 'Tanggal selesai harus berupa tanggal yang valid',
        'date.greater': 'Tanggal selesai tidak boleh sebelum tanggal mulai',
        'any.required': 'Tanggal selesai harus diisi'
    }),
    price: JOI.number()
    .integer()
    .min(0)
    .required()
    .messages({
        'number.base': 'Harga harus berupa angka',
        'number.integer': 'Harga harus berupa bilangan bulat',
        'number.min': 'Harga tidak boleh kurang dari 0',
        'any.required': 'Harga harus diisi'
    }),
    quest_pool_value: JOI.number()
    .integer()
    .min(0)
    .default(30)
    .messages({
        'number.base': 'Nilai pool quest harus berupa angka',
        'number.integer': 'Nilai pool quest harus berupa bilangan bulat',
        'number.min': 'Nilai pool quest tidak boleh kurang dari 0'
    }),
    status: JOI.string()
    .valid('upcoming', 'in_season', 'ended')
    .default('upcoming')
    .messages({
        'any.only': 'Status harus salah satu dari: upcoming, in_season, ended',
        'any.required': 'Status harus diisi'
    })
})

const updateBattlepassSchema = createBattlepassSchema.fork(['name','start_date', 'end_date', 'price', 'quest_pool_value', 'status'], (schema) => schema.optional());

module.exports = {
  createBattlepassSchema,
  updateBattlepassSchema
};