const JOI = require('joi');

const createItemSchema = JOI.object({
  name: JOI.string()
    .required()
    .messages({
      'string.empty': 'Nama item tidak boleh kosong',
      'any.required': 'Nama item harus diisi'
    }),
  description: JOI.string()
    .optional()
    .allow(''),
  type: JOI.string()
    .valid('equipment', 'consumable', 'material')
    .required()
    .messages({
      'any.only': 'Tipe item harus salah satu dari: equipment, consumable, material',
      'any.required': 'Tipe item harus diisi'
    }),
  base_price: JOI.number()
    .integer()
    .min(0)
    .required()
    .messages({
        'number.base': 'Harga dasar harus berupa angka',
        'number.integer': 'Harga dasar harus berupa bilangan bulat',
        'number.min': 'Harga dasar tidak boleh kurang dari 0',
        'any.required': 'Harga dasar harus diisi'
        }),
});

const updateItemSchema = createItemSchema.fork(['name', 'description', 'type', 'base_price'], (schema) => schema.optional());

module.exports = {
    createItemSchema,
    updateItemSchema
};