'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'profiles',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      order_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
  }
};