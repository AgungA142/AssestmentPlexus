const JOI = require('joi');

const registerSchema = JOI.object({
  email: JOI.string()
    .email()
    .required()
    .messages({
      'string.email': 'email harus berupa alamat email yang valid',
      'any.required': 'email tidak boleh kosong',
    }),
  password: JOI.string()
    .min(8)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .messages({
      'string.pattern.base': 'passwrod harus mengandung setidaknya satu huruf besar, satu huruf kecil, satu angka, dan satu karakter khusus',
      'string.min': 'password harus memiliki minimal 8 karakter',
      'any.required': 'Password tidak boleh kosong',
    }),
  role_name: JOI.string()
    .lowercase()
    .valid('admin', 'player')
    .required()
    .messages({
      'any.only': 'role_name harus berupa "admin" atau "player"',
      'any.required': 'role_name tidak boleh kosong',
     }),
});

const loginSchema = JOI.object({
  email: JOI.string()
    .email()
    .required()
    .messages({
      'string.email': 'email harus berupa alamat email yang valid',
      'any.required': 'email tidak boleh kosong',
    }),
  password: JOI.string()
    .required()
    .messages({
      'any.required': 'Password tidak boleh kosong',
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
};