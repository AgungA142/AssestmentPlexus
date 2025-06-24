'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class quest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      quest.belongsToMany(models.profile, {
        through: models.profile_quest,
        foreignKey: 'quest_id',
        as: 'profiles',
      });
      quest.belongsToMany(models.battlepass, {
        through: models.battlepass_quest,
        foreignKey: 'quest_id',
        as: 'battlepasses',
      });
      quest.hasMany(models.profile_quest, {
        foreignKey: 'quest_id',
        as: 'profile_quests',
      });
      quest.hasMany(models.battlepass_quest, {
        foreignKey: 'quest_id',
        as: 'battlepass_quests',
      });
      quest.belongsTo(models.item, {
        foreignKey: 'reward_item_id',
        as: 'reward_item',
      });
    }
  }
  quest.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quest_type: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'battlepass'),
      allowNull: false,
    },
    objective: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reward_type: {
      type: DataTypes.ENUM('game_currency', 'item'),
      allowNull: false,
    },
    reward_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reward_item_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'items',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'quest',
  });
  return quest;
};