'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('profile_quests', {
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
      profile_battlepass_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'profile_battlepasses',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM('in_progress', 'completed', 'expired'),
        allowNull: false,
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
    await queryInterface.dropTable('profile_quests');
  }
};