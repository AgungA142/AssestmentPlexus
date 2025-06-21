'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // mengambil data role player dari tabel roles
    const [rolePlayer] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'player';`
    );
    const rolePlayerId = rolePlayer[0].id;

    //membuat 100 data user dan profilenya
    const users = [];
    const profiles = [];
    for (let i = 1; i <= 100; i++) {
      const userId = uuidv4();
      const username = `user${i}`;
      const password = await bcrypt.hash('password123', 10);
      users.push({
        id: userId,
        email: `example${i}@gmail.com`,
        password: password,
        role_id: rolePlayerId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      profiles.push({
        id: uuidv4(),
        user_id: userId,
        username: username,
        score: Math.floor(Math.random() * 1000), // skor acak antara 0-999
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    // memasukkan data user dan profile ke tabel
    await queryInterface.bulkInsert('users', users, {});
    await queryInterface.bulkInsert('profiles', profiles, {});
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // Menghapus data dari tabel Profiles dan Users
    await queryInterface.bulkDelete('profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
