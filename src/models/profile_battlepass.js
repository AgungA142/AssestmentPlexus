'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile_battlepass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      profile_battlepass.belongsTo(models.profile, {
        foreignKey: 'profile_id',
        as: 'profile',
      });
      profile_battlepass.belongsTo(models.battlepass, {
        foreignKey: 'battlepass_id',
        as: 'battlepass',
      });

    }
  }
  profile_battlepass.init({
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
        model: 'profiles',
        key: 'id',
      },
    },
    battlepass_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'battlepasses',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'expired'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'profile_battlepass',
    indexes: [
      {
        unique: true,
        fields: ['profile_id', 'battlepass_id']
      }
    ]
  });
  return profile_battlepass;
};