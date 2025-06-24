'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('quests', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      quest_type: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'battlepass'),
        allowNull: false
      },
      objective: {
        type: Sequelize.STRING,
        allowNull: false
      },
      reward_type: {
        type: Sequelize.ENUM('game_currency', 'item'),
        allowNull: false
      },
      reward_value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reward_item_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'items',
          key: 'id'
        }
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
    await queryInterface.dropTable('quests');
  }
};