'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class battlepass_quest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      battlepass_quest.belongsTo(models.battlepass, {
        foreignKey: 'battlepass_id',
        as: 'battlepass',
      });
      battlepass_quest.belongsTo(models.quest, {
        foreignKey: 'quest_id', 
        as: 'quest',
      });
    }
  }
  battlepass_quest.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    battlepass_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'battlepasses',
        key: 'id',
      },
    },
    quest_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'quests',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'battlepass_quest',
  });
  return battlepass_quest;
};