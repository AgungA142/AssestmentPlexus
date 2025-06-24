'use strict';
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const questsData = [];

    // Daily Quests (10 quests)
    const dailyQuests = [
      { title: 'Daily Login', description: 'Login to the game daily', objective: 'Login once', reward_value: 50 },
      { title: 'Play 3 Matches', description: 'Complete 3 matches today', objective: 'Complete matches', reward_value: 100 },
      { title: 'Defeat 10 Enemies', description: 'Eliminate 10 enemies in any game mode', objective: 'Defeat enemies', reward_value: 75 },
      { title: 'Collect 5 Items', description: 'Collect 5 items during gameplay', objective: 'Collect items', reward_value: 60 },
      { title: 'Win 1 Match', description: 'Win at least 1 match today', objective: 'Win matches', reward_value: 150 },
      { title: 'Score 1000 Points', description: 'Achieve 1000 points in a single match', objective: 'Score points', reward_value: 120 },
      { title: 'Use 3 Abilities', description: 'Use any ability 3 times', objective: 'Use abilities', reward_value: 80 },
      { title: 'Survive 5 Minutes', description: 'Survive for 5 minutes in survival mode', objective: 'Survive time', reward_value: 100 },
      { title: 'Deal 2000 Damage', description: 'Deal 2000 total damage to enemies', objective: 'Deal damage', reward_value: 110 },
      { title: 'Complete Tutorial', description: 'Complete the daily tutorial challenge', objective: 'Complete tutorial', reward_value: 90 }
    ];

    dailyQuests.forEach(quest => {
      questsData.push({
        id: uuidv4(),
        title: quest.title,
        description: quest.description,
        quest_type: 'daily',
        objective: quest.objective,
        reward_type: 'game_currency',
        reward_value: quest.reward_value,
        reward_item_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Weekly Quests (10 quests)
    const weeklyQuests = [
      { title: 'Weekly Champion', description: 'Win 10 matches this week', objective: 'Win matches', reward_value: 500 },
      { title: 'Experience Hunter', description: 'Gain 5000 XP this week', objective: 'Gain XP', reward_value: 400 },
      { title: 'Item Collector', description: 'Collect 50 items this week', objective: 'Collect items', reward_value: 350 },
      { title: 'Enemy Eliminator', description: 'Defeat 100 enemies this week', objective: 'Defeat enemies', reward_value: 450 },
      { title: 'Match Marathon', description: 'Play 25 matches this week', objective: 'Play matches', reward_value: 600 },
      { title: 'Damage Dealer', description: 'Deal 20000 total damage this week', objective: 'Deal damage', reward_value: 550 },
      { title: 'Survival Expert', description: 'Survive 30 minutes total this week', objective: 'Survive time', reward_value: 400 },
      { title: 'Ability Master', description: 'Use abilities 50 times this week', objective: 'Use abilities', reward_value: 300 },
      { title: 'Score Achiever', description: 'Score 25000 points total this week', objective: 'Score points', reward_value: 500 },
      { title: 'Weekly Dedication', description: 'Login 7 days this week', objective: 'Login days', reward_value: 250 }
    ];

    weeklyQuests.forEach(quest => {
      questsData.push({
        id: uuidv4(),
        title: quest.title,
        description: quest.description,
        quest_type: 'weekly',
        objective: quest.objective,
        reward_type: 'game_currency',
        reward_value: quest.reward_value,
        reward_item_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Monthly Quests (10 quests)
    const monthlyQuests = [
      { title: 'Monthly Master', description: 'Win 50 matches this month', objective: 'Win matches', reward_value: 2000 },
      { title: 'Experience Legend', description: 'Gain 50000 XP this month', objective: 'Gain XP', reward_value: 1800 },
      { title: 'Ultimate Collector', description: 'Collect 500 items this month', objective: 'Collect items', reward_value: 1500 },
      { title: 'Enemy Destroyer', description: 'Defeat 1000 enemies this month', objective: 'Defeat enemies', reward_value: 1700 },
      { title: 'Marathon Runner', description: 'Play 100 matches this month', objective: 'Play matches', reward_value: 2200 },
      { title: 'Damage Lord', description: 'Deal 200000 total damage this month', objective: 'Deal damage', reward_value: 2100 },
      { title: 'Survival King', description: 'Survive 300 minutes total this month', objective: 'Survive time', reward_value: 1600 },
      { title: 'Ability God', description: 'Use abilities 500 times this month', objective: 'Use abilities', reward_value: 1400 },
      { title: 'Score Legend', description: 'Score 250000 points total this month', objective: 'Score points', reward_value: 1900 },
      { title: 'Monthly Dedication', description: 'Login 30 days this month', objective: 'Login days', reward_value: 1200 }
    ];

    monthlyQuests.forEach(quest => {
      questsData.push({
        id: uuidv4(),
        title: quest.title,
        description: quest.description,
        quest_type: 'monthly',
        objective: quest.objective,
        reward_type: 'game_currency',
        reward_value: quest.reward_value,
        reward_item_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Battlepass Quests (400 quests)
    const battlepassQuestTemplates = [
      { title: 'Eliminate Enemies', objective: 'Defeat enemies', rewards: [50, 100, 150, 200, 250] },
      { title: 'Win Matches', objective: 'Win matches', rewards: [100, 200, 300, 400, 500] },
      { title: 'Collect Items', objective: 'Collect items', rewards: [75, 125, 175, 225, 275] },
      { title: 'Deal Damage', objective: 'Deal damage', rewards: [80, 130, 180, 230, 280] },
      { title: 'Survive Time', objective: 'Survive time', rewards: [70, 120, 170, 220, 270] },
      { title: 'Use Abilities', objective: 'Use abilities', rewards: [60, 110, 160, 210, 260] },
      { title: 'Score Points', objective: 'Score points', rewards: [90, 140, 190, 240, 290] },
      { title: 'Play Matches', objective: 'Play matches', rewards: [120, 170, 220, 270, 320] },
      { title: 'Complete Objectives', objective: 'Complete objectives', rewards: [100, 150, 200, 250, 300] },
      { title: 'Gain Experience', objective: 'Gain XP', rewards: [85, 135, 185, 235, 285] }
    ];

    // Generate 400 battlepass quests (40 sets of each template)
    for (let set = 0; set < 40; set++) {
      battlepassQuestTemplates.forEach((template, templateIndex) => {
        const questNumber = (set * 10) + templateIndex + 1;
        const rewardIndex = Math.floor(Math.random() * template.rewards.length);
        
        questsData.push({
          id: uuidv4(),
          title: `${template.title} ${questNumber}`,
          description: `Battlepass quest: ${template.objective}`,
          quest_type: 'battlepass',
          objective: template.objective,
          reward_type: 'game_currency',
          reward_value: template.rewards[rewardIndex],
          reward_item_id: null,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    }

    await queryInterface.bulkInsert('quests', questsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('quests', null, {});
  }
};