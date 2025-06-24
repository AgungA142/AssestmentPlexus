'use strict';
const { v4: uuidv4 } = require('uuid');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get current date for setting start/end dates
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const futureDate2 = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000)); 
    const futureDate3 = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
    const pastDate1 = new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000)); 


    const battlepassData = [
      // 2 Upcoming battlepasses
      {
        id: uuidv4(),
        name: 'Season 1',
        description: 'The first season battlepass',
        startDate: pastDate1,
        endDate: futureDate1,
        price: 1000,
        quest_pool_value: 50, 
        status: 'in_season', 
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Season 1 Premium',
        description: 'Unlock exclusive rewards in Season 1',
        startDate: pastDate1,
        endDate: futureDate1,
        price: 1500,
        quest_pool_value: 100, 
        status: 'in_season', 
        createdAt: now,
        updatedAt: now
      },

      {
        id: uuidv4(),
        name: 'Season 2',
        description: 'The second season battlepass',
        startDate: futureDate2,
        endDate: futureDate3,
        price: 1200,
        quest_pool_value: 50,
        status: 'upcoming',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Season 2 Premium',
        description: 'Unlock exclusive rewards in Season 2',
        startDate: futureDate2,
        endDate: futureDate3,
        price: 2000,
        quest_pool_value: 100,
        status: 'upcoming', 
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('battlepasses', battlepassData, {});

    // Get battlepass IDs and quest IDs for creating relationships
    const [battlepasses] = await queryInterface.sequelize.query(
      'SELECT id, quest_pool_value FROM battlepasses ORDER BY id'
    );

    const [battlepassQuests] = await queryInterface.sequelize.query(
      'SELECT id FROM quests WHERE quest_type = "battlepass"'
    );

    // Create battlepass_quest relationships
    const battlepassQuestData = [];

    // Helper function to shuffle array
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Assign quests to each battlepass
    battlepasses.forEach((battlepass, index) => {
      const questPoolSize = battlepass.quest_pool_value;
      const shuffledQuests = shuffleArray(battlepassQuests);
      const selectedQuests = shuffledQuests.slice(0, questPoolSize);

      selectedQuests.forEach(quest => {
        battlepassQuestData.push({
          id: require('uuid').v4(),
          battlepass_id: battlepass.id, // INTEGER sesuai dengan struktur yang ada
          quest_id: quest.id, // UUID sesuai dengan struktur yang ada
          createdAt: now,
          updatedAt: now
        });
      });
    });

    await queryInterface.bulkInsert('battlepass_quests', battlepassQuestData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('battlepass_quests', null, {});
    await queryInterface.bulkDelete('battlepasses', null, {});
  }
};
