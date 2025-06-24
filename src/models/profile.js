'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'user',
      });
      profile.hasMany(models.inventory, {
        foreignKey: 'profile_id',
        as: 'inventories',
      });
      profile.hasMany(models.transaction, {
        foreignKey: 'profile_id',
        as: 'transactions',
      });
      profile.hasMany(models.profile_battlepass, {
        foreignKey: 'profile_id',
        as: 'profile_battlepasses',
      });
      profile.hasMany(models.profile_quest, {
        foreignKey: 'profile_id',
        as: 'profile_quests',
      });
      profile.belongsToMany(models.battlepass, {
        through: models.profile_battlepass,
        foreignKey: 'profile_id',
        as: 'battlepasses',
      });
      profile.belongsToMany(models.quest, {
        through: models.profile_quest,
        foreignKey: 'profile_id',
        as: 'quests',
      });

    }
  }
  profile.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    game_currency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};