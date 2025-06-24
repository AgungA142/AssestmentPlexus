const JOI = require('joi');

const createRoleSchema = JOI.object({
  name: JOI.string()
    .required()
    .messages({
      'string.empty': 'Nama role tidak boleh kosong',
      'any.required': 'Nama role harus diisi'
    }),
})

const updateRoleSchema = createRoleSchema.fork(['name'], (schema) => schema.optional());

module.exports = {
  createRoleSchema,
  updateRoleSchema
};