const bcrypt = require('bcryptjs');

/**
 * enkripsi password 
 * @param {string} plainPassword - Password yang akan dienkripsi
 * @returns {Promise<string>} - Password yang sudah dienkripsi
 */
    
const encryptPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    const resultHash = await bcrypt.hash(plainPassword, salt);
    return resultHash;
};

/**
 * Membandingkan password yang dimasukkan dengan password yang sudah dienkripsi
 * @param {string} plainPassword - Password yang akan dibandingkan
 * @param {string} hashedPassword - Password yang sudah dienkripsi
 * @returns {Promise<boolean>} - Hasil perbandingan, true jika cocok, false jika tidak
 */

const comparePassword = async (plainPassword, hashedPassword) => {
  const compareResult = await bcrypt.compare(plainPassword, hashedPassword);
  return compareResult;
};

module.exports = {
  encryptPassword,
  comparePassword,
};
