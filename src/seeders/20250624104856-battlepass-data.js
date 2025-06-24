'use strict';
const { v4: uuidv4 } = require('uuid');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get current date for setting start/end dates
    
    const batchInsert = async (tableName, data, batch_size = 100) => {
      for (let i = 0; i < data.length; i += batch_size) {
        const batch = data.slice(i, i + batch_size);
        await queryInterface.bulkInsert(tableName, batch, {});
      }
    };
    
    
    const now = new Date();
    const futureDate1 = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    const futureDate2 = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000)); 
    const futureDate3 = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
    const pastDate1 = new Date(now.getTime() - (10 * 24 * 60 * 60 * 1000)); 


    const battlepassData = [
      //2 ended battlepasses
      {
        id: uuidv4(),
        name: 'Season 0',
        description: 'The first season battlepass',
        start_date: new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)),
        end_date: new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)), 
        price: 1000,
        quest_pool_value: 50,
        status: 'in_season',
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        name: 'Season 0 Premium',
        description: 'Unlock exclusive rewards in Season 0',
        start_date: new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000)),
        end_date: new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)), 
        price: 1500,
        quest_pool_value: 100,
        status: 'in_season',
        createdAt: now,
        updatedAt: now
      },
      // 2 Upcoming battlepasses
      {
        id: uuidv4(),
        name: 'Season 1',
        description: 'The first season battlepass',
        start_date: pastDate1,
        end_date: futureDate1,
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
        start_date: pastDate1,
        end_date: futureDate1,
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
        start_date: futureDate2,
        end_date: futureDate3,
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
        start_date: futureDate2,
        end_date: futureDate3,
        price: 2000,
        quest_pool_value: 100,
        status: 'upcoming', 
        createdAt: now,
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('battlepasses', battlepassData, {});

    
    const [battlepasses] = await queryInterface.sequelize.query(
      'SELECT id, quest_pool_value FROM battlepasses ORDER BY id'
    );

    const [battlepassQuests] = await queryInterface.sequelize.query(
      'SELECT id FROM quests WHERE quest_type = "battlepass"'
    );

    
    const battlepassQuestData = [];
    const battlepassQuestMap = {};

   
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    
    battlepasses.forEach((battlepass, index) => {
      const questPoolSize = battlepass.quest_pool_value;
      const shuffledQuests = shuffleArray(battlepassQuests);
      const selectedQuests = shuffledQuests.slice(0, questPoolSize);

      battlepassQuestMap[battlepass.id] = selectedQuests.map(quest => quest.id);

      selectedQuests.forEach(quest => {
        battlepassQuestData.push({
          id: require('uuid').v4(),
          battlepass_id: battlepass.id,
          quest_id: quest.id, 
          createdAt: now,
          updatedAt: now
        });
      });
    });

    await queryInterface.bulkInsert('battlepass_quests', battlepassQuestData, {});


    const [profiles] = await queryInterface.sequelize.query(
      'SELECT id FROM profiles'
    );

    if (profiles.length === 0) {
      console.log('No profiles found, skipping profile_battlepass seeding');
      return;
    }
    //ambil data season 0 dan season 0 premium
    const [season0Battlepasses] = await queryInterface.sequelize.query(
      "SELECT id, name, quest_pool_value FROM battlepasses WHERE name IN ('Season 0', 'Season 0 Premium')"
    );

    const profileBattlepassData = [];

    season0Battlepasses.forEach(battlepass => {
        profiles.forEach(profile => {
          profileBattlepassData.push({
            id: uuidv4(),
            profile_id: profile.id,
            battlepass_id: battlepass.id,
            status: 'active',
            createdAt: now,
            updatedAt: now
          });
        });
      }
    );

    await batchInsert('profile_battlepasses', profileBattlepassData, 100);
    
    const [profileBattlepasses] = await queryInterface.sequelize.query(
      `SELECT pb.id, pb.profile_id, pb.battlepass_id, pb.status, bp.name 
       FROM profile_battlepasses pb 
       JOIN battlepasses bp ON pb.battlepass_id = bp.id 
       WHERE bp.name IN ('Season 0', 'Season 0 Premium')`
    );

    const profileQuestData = [];
    profileBattlepasses.forEach(profileBattlepass => {
      const availableQuestIds = battlepassQuestMap[profileBattlepass.battlepass_id] || [];
      
      if (availableQuestIds.length === 0) {
        console.log(`No quests found for battlepass ${profileBattlepass.battlepass_id}`);
        return;
      }

      
      const shuffledQuestIds = shuffleArray(availableQuestIds);
      const selectedQuestIds = shuffledQuestIds.slice(0, Math.min(30, shuffledQuestIds.length));

      selectedQuestIds.forEach((questId) => { 

        profileQuestData.push({
          id: uuidv4(),
          profile_id: profileBattlepass.profile_id,
          quest_id: questId,
          profile_battlepass_id: profileBattlepass.id,
          status: 'in_progress',
          createdAt: now,
          updatedAt: now
        });
      });
    });

    await batchInsert('profile_quests', profileQuestData, 100);

  },
  

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('profile_quests', null, {});
    await queryInterface.bulkDelete('profile_battlepasses', null, {});
    await queryInterface.bulkDelete('battlepass_quests', null, {});
    await queryInterface.bulkDelete('battlepasses', null, {});
  }
};
