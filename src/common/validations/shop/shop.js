const JOI = require('joi');

const createShopSchema = JOI.object({
    name: JOI.string()
        .required()
        .messages({
        'string.empty': 'Nama toko tidak boleh kosong',
        'any.required': 'Nama toko harus diisi'
        }),
    description: JOI.string()
        .optional()
        .allow(''),
    shop_type: JOI.string()
        .valid('general', 'equipment', 'consumable', 'material')
        .required()
        .messages({
            'any.only': 'Tipe toko harus salah satu dari: general, event, battlepass',
            'any.required': 'Tipe toko harus diisi'
        }),
})

const updateShopSchema = createShopSchema.fork(['name', 'description', 'shop_type'], (schema) => schema.optional());

module.exports = {
    createShopSchema,
    updateShopSchema
};