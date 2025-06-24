'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class battlepass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      battlepass.hasMany(models.profile_battlepass, {
        foreignKey: 'battlepass_id',
        as: 'profile_battlepasses',
      });
      battlepass.hasMany(models.battlepass_quest, {
        foreignKey: 'battlepass_id',
        as: 'battlepass_quests',
      });
      battlepass.belongsToMany(models.quest, {
        through: models.battlepass_quest,
        foreignKey: 'battlepass_id',
        as: 'quests',
      });
      battlepass.belongsToMany(models.profile, {
        through: models.profile_battlepass,
        foreignKey: 'battlepass_id',
        as: 'profiles',
      });
    }
  }
  battlepass.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quest_pool_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    status: {
      type: DataTypes.ENUM('upcoming', 'in_season', 'ended'),
      defaultValue: 'upcoming',
      allowNull: false,
    },
    
  }, {
    sequelize,
    modelName: 'battlepass',
  });
  return battlepass;
};