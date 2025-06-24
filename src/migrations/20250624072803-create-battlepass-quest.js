'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('battlepass_quests', {
      id: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      battlepass_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'battlepasses',
          key: 'id'
        }
      },
      quest_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'quests',
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
    await queryInterface.dropTable('battlepass_quests');
  }
};