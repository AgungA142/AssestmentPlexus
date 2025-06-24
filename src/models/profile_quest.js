'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile_quest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile_quest.belongsTo(models.profile, {
        foreignKey: 'profile_id',
        as: 'profile',
      });
      profile_quest.belongsTo(models.quest, {
        foreignKey: 'quest_id',
        as: 'quest',
      });
      profile_quest.belongsTo(models.profile_battlepass, {
        foreignKey: 'profile_battlepass_id',
        as: 'profile_battlepass',
      });
    }
  }
  profile_quest.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    profile_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'profile',
        key: 'id',
      },
    },
    quest_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'quest',
        key: 'id',
      },
    },
    profile_battlepass_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'profile_battlepass',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'completed', 'expired'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'profile_quest',
  });
  return profile_quest;
};